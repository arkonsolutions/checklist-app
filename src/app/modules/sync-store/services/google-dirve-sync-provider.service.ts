import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, Observable, of, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AuthProviderEnum } from "../../auth-store/model/auth-provider.enum";
import { AuthService } from "../../auth-store/services/auth.service";
import { ICheckListItem } from "../../check-list-services/model/check-list-item.model";
import { SyncProviderKeyEnum } from "../model/sync-provider-key.enum";
import { SyncProviderSettingsService } from "./sync-provider-settings.service";
import { SyncProviderService } from "./sync-provider.service";

@Injectable()
export class GoogleDriveSyncProviderService extends SyncProviderService<ICheckListItem> {
  
  public get defaultSettings(): { [key: string]: string; } {
    return {'path': 'AppSync/Checklist'};
  }
  
  public get baseURI(): string {
    return 'https://www.googleapis.com/drive/v3';
  }
  
  public get requiredAuthProviderKey(): AuthProviderEnum {
    return AuthProviderEnum.Google;
  }

  public get providerKey(): SyncProviderKeyEnum {
    return SyncProviderKeyEnum.GoogleDrive;
  }

  constructor(
    settingsService: SyncProviderSettingsService,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {super(settingsService);}

  public stopActivity(): Observable<boolean> {
    return of(true);
  }
  public checkConnection(): Observable<boolean> {
    return this.httpClient.get(`${this.baseURI}/about?fields=storageQuota`).pipe(
      tap(res => console.log('res', JSON.stringify(res))),
      map(() => true),
    )
  }

  private _providerUpdated$: Subject<ICheckListItem> = new Subject<ICheckListItem>();
  public providerUpdated$: Observable<ICheckListItem> = this._providerUpdated$.asObservable();
  
  public sendToProvider(data: ICheckListItem[]): Observable<any> {
    throw new Error("Method not implemented.");
  }

  /** Убедиться что файл существует, если нет - создать. Вернуть результат. */
  private ensureRemoteFileAndFetch(): Observable<any> {
    return EMPTY;
  }

}