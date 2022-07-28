import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthProviderEnum } from "../../auth-store/model/auth-provider.enum";
import { SyncProviderKeyEnum } from "../model/sync-provider-key.enum";
import { SyncProviderSettingsService } from "./sync-provider-settings.service";
import { SyncProviderService } from "./sync-provider.service";

export interface GoogleTaskItem {

}

@Injectable()
export class GoogleTasksSyncProviderService extends SyncProviderService<GoogleTaskItem> {
  
  public get defaultSettings(): { [key: string]: string; } {
    return {};
  }

  constructor(settingsService: SyncProviderSettingsService) {super(settingsService);}
  
  public get baseURI(): string {
    return "https://tasks.googleapis.com";
  }
  
  public get requiredAuthProviderKey(): AuthProviderEnum {
    return AuthProviderEnum.Google;
  }
  
  public stopActivity(): Observable<boolean> {
    throw new Error("Method not implemented.");
  }
  public checkConnection(): Observable<boolean> {
    throw new Error("Method not implemented.");
  }
  public providerUpdated$: Observable<GoogleTaskItem>;
  public sendToProvider(data: GoogleTaskItem[]): Observable<any> {
    throw new Error("Method not implemented.");
  }
  public get providerKey(): SyncProviderKeyEnum {
    return SyncProviderKeyEnum.GoogleTasks;
  }
}