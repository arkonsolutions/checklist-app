import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { UserIdentity } from "../model/user-identity.model";
import { AuthProviderEnum } from "../model/auth-provider.enum";

const google_scopes = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid';

@Injectable({providedIn: 'root'})
export class AuthService {
  private _identity$: BehaviorSubject<UserIdentity[]> = new BehaviorSubject<UserIdentity[]>([]);
  public identity$: Observable<UserIdentity[]> = this._identity$.asObservable();

  public get identity(): UserIdentity[] {
    return this._identity$.value;
  }

  constructor(private googlePlus: GooglePlus) {}

  /** Инициализация провайдеров */
  public async init(): Promise<any> {
    let singnInResponse = await this.googlePlus.trySilentLogin({})
      .then(res => res)
      .catch(res => res);
    return this.handleSignInResponse(AuthProviderEnum.Google, singnInResponse);
  }

  public async silentSignIn(provider: AuthProviderEnum): Promise<UserIdentity> {
    let result: UserIdentity = null;
    let signInResponse: any = {};

    if (provider === AuthProviderEnum.Google) {
      signInResponse = await this.googlePlus.trySilentLogin({
        scopes: google_scopes
      })
        .then(res => res)
        .catch(res => res);
    }

    return this.handleSignInResponse(provider, signInResponse);
  }

  /** Запуск процесса аутентификации с указанным провайдером */
  public async signIn(provider: AuthProviderEnum): Promise<UserIdentity> {
    let result: UserIdentity = null;
    let signInResponse: any = {};

    if (provider === AuthProviderEnum.Google) {

      // window["plugins"].googleplus.login(
      //   {
      //       'scopes': google_scopes,
      //       'offline': true, 
      //       'cookiepolicy': 'none',
      //       'webApiKey': 'CODE' 
      //   });

      signInResponse = await this.googlePlus.login({
        offline: false,
        scopes: google_scopes
      });
      console.log('signInResponse', JSON.stringify(signInResponse));
    }

    return this.handleSignInResponse(provider, signInResponse);
  }

  /** Logout для указанного провайдера */
  public async signOut(provider: AuthProviderEnum) {
    if (provider === AuthProviderEnum.Google) {
      return this.googlePlus.logout().then(res => {
        this._identity$.next(
          this._identity$.value.filter(i => i.provider !== provider)
        );
      });
    }
  }

  private handleSignInResponse(provider: AuthProviderEnum, response: any): UserIdentity {
    let result: UserIdentity = null;
   
    if (provider === AuthProviderEnum.Google) {
      if (!!response && !response.error && !(typeof response === 'string')) {
        result =  {
          email: response.email,
          givenName: response.givenName,
          familyName: response.familyName,
          displayName: response.displayName,
          provider: provider,
          accessToken: response.accessToken
        } as UserIdentity;
      }
    }

    this._identity$.next([
      ...this._identity$.value.filter(ui => ui.provider !== provider), 
      ...(!!result ? [result] : [])
    ]);

    return result;
  }
}