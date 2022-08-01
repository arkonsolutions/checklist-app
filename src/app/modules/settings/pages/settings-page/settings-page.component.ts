import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { UserIdentity } from 'src/app/modules/auth-store/model/user-identity.model';
import { SyncProviderKeyEnum } from 'src/app/modules/sync-store/model/sync-provider-key.enum';
import { 
  selectIsExportDataProcess,
  selectIsImportDataProcess,
  selectProviders 
} 
from 'src/app/modules/sync-store/sync.selectors';
import { ISyncProviderState } from 'src/app/modules/sync-store/sync.state';
import * as appActions from '../../../../store/app.actions';
import * as authActions from '../../../auth-store/auth.actions';
import * as authSelectors from '../../../auth-store/auth.selectors';
import * as syncActions from '../../../sync-store/sync.actions';
import { selectAvailableUILanguages, selectIsHideCompletedTasks, selectisRecognitionWhenAdding, selectRecognizeSpeechLanguage, selectUILanguage, selectisCheckUpdatesAtStartup } from 'src/app/modules/settings-store/settings.selectors';
import * as settingsActions from '../../../settings-store/settings.actions';
import { AuthProviderEnum } from 'src/app/modules/auth-store/model/auth-provider.enum';
import { selectIsRecognizeSpeechAvailable, selectRecognizeSpeechAvailableLanguages, selectIsCheckUpdatesProcess, selectIsBinariesDownloadProcess, selectIsUpdateCheckAvailable } from 'src/app/store/app.selectors';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit, OnDestroy {

  public SyncProviderKeyEnum = SyncProviderKeyEnum;

  public googleIdentity$: Observable<UserIdentity> = this.store.select(authSelectors.selectProviderIdentity(AuthProviderEnum.Google));
  public syncProviders$: Observable<ISyncProviderState[]> = this.store.select(selectProviders);

  private unsubscribe$: Subject<void> = new Subject<void>();

  public isExportDataProcess$: Observable<boolean> = this.store.select(selectIsExportDataProcess);
  public isImportDataProcess$: Observable<boolean> = this.store.select(selectIsImportDataProcess);

  public isUpdateCheckAvailable$: Observable<boolean> = this.store.select(selectIsUpdateCheckAvailable);
  
  public isHideCompletedTasks$: Observable<boolean> = this.store.select(selectIsHideCompletedTasks);
  public recognizeSpeechLanguage$: Observable<string> = this.store.select(selectRecognizeSpeechLanguage);
  public availableUILanguages$: Observable<[string, string][]> = this.store.select(selectAvailableUILanguages);
  public uiLanguage$: Observable<string> = this.store.select(selectUILanguage);
  public isRecognitionWhenAdding$: Observable<boolean> = this.store.select(selectisRecognitionWhenAdding);
  public isCheckUpdatesAtStartup$: Observable<boolean> = this.store.select(selectisCheckUpdatesAtStartup);

  public busy$: Observable<boolean> = combineLatest([
    this.isExportDataProcess$,
    this.isImportDataProcess$
  ]).pipe(
    takeUntil(this.unsubscribe$),
    map(
      ([isExportDataProcess, isImportDataProcess]) => !!isExportDataProcess || !!isImportDataProcess
    )
  );

  public selectIsRecognizeSpeechAvailable$ = this.store.select(selectIsRecognizeSpeechAvailable);
  public selectRecognizeSpeechAvailableLanguages$ = this.store.select(selectRecognizeSpeechAvailableLanguages)

  constructor(
    private store: Store
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {}

  public googleSignIn() {
    this.store.dispatch(authActions.signIn({ provider: AuthProviderEnum.Google }));
  }

  public googleSignOut() {
    this.store.dispatch(authActions.signOut({ provider: AuthProviderEnum.Google }));
  }

  public toggleSyncProviderEnabled(provider: SyncProviderKeyEnum) {
    this.store.dispatch(syncActions.toggleProviderEnabled({ provider }));
  }

  public openSyncProviderSettings(provider: SyncProviderKeyEnum) {
    this.store.dispatch(syncActions.openProviderSettings({ provider }));
  }

  public exportData() {
    this.store.dispatch(syncActions.exportData());
  }

  public importData() {
    this.store.dispatch(syncActions.importData());
  }

  public toggleHideCompletedTasks() {
    this.store.dispatch(settingsActions.toggleHideCompletedTasks());
  }

  public onSelectRecognizeSpeechLanguage(lng: string) {
    this.store.dispatch(settingsActions.selectRecognizeSpeechLanguage({lng}));
  }

  public onSelectUILanguage(lng: string) {
    this.store.dispatch(settingsActions.selectUILanguage({lng}));
  }

  public toggleRecognitionWhenAdding() {
    this.store.dispatch(settingsActions.toggleRecognitionWhenAdding());
  }

  public toggleCheckUpdatesAtStartup() {
    this.store.dispatch(settingsActions.toggleCheckUpdatesAtStartup());
  }

  public checkUpdates() {
    this.store.dispatch(appActions.checkUpdates());
  }

}