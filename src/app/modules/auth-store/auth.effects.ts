import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects";
import { AuthService } from "./services/auth.service";
import * as authActions from './auth.actions';
import * as appActions from '../../store/app.actions';
import { catchError, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { from, of } from "rxjs";
import { Action, Store } from "@ngrx/store";
import { AuthProviderEnum } from "./model/auth-provider.enum";

@Injectable()
export class AuthEffects implements OnInitEffects {
  constructor(
    private actions$: Actions<authActions.AuthActionsUnion>,
    private store: Store,
    private authService: AuthService
  ) {}

  ngrxOnInitEffects(): Action {
    return authActions.initialize();
  }

  initialize$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.initialize),
    switchMap(payload => from(this.authService.init())),
    map(() => authActions.initializeSuccess()),
    catchError((err) => of(authActions.initializeFailure(err)))
  ));
  initializeSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.initializeSuccess),
    map(args => authActions.silentSignInForAll())
  ));
  initializeFailure$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.initializeFailure),
    map(args => appActions.displayError({error: `Auth providers initialization failure: "${args.error}"`}))
  ));


  silentSignInForAll$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.silentSignInForAll),
    tap(() => {
      this.store.dispatch(authActions.silentSignIn({provider: AuthProviderEnum.Google}));
    })
  ), {dispatch: false});
  silentSignIn$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.silentSignIn),
    mergeMap(payload => from(this.authService.silentSignIn(payload.provider))
      .pipe(
        map(signInResponse => authActions.signInSuccess({provider: payload.provider, identity: signInResponse})),
        catchError((err) => of(authActions.signInFailure({ error: err, provider: payload.provider  })))  
      )
    ),
  ));


  signIn$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.signIn),
    mergeMap(payload => from(this.authService.signIn(payload.provider))
      .pipe(
        map(signInResponse => authActions.signInSuccess({provider: payload.provider, identity: signInResponse})),
        catchError((err) => of(authActions.signInFailure({error: err, provider: payload.provider})))
      )
    )
  ));
  signInFailure$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.signInFailure),
    map(args => appActions.displayError({ error: `Sign in failed: "${args.error}"` }))
  ));


  signOut$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.signOut),
    mergeMap(payload => from(this.authService.signOut(payload.provider))
      .pipe(
        map(() => authActions.signOutSuccess({provider: payload.provider })),
        catchError((err) => of(authActions.signOutFailure({error: err, provider: payload.provider})))
      )
    )
  ));
  signOutFailure$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.signOutFailure),
    map(args => appActions.displayError({ error: `Sign out failed: "${args.error}"` }))
  ));

}