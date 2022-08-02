import { Injectable } from '@angular/core';
import { AlertController, MenuController, NavController, ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ConfigStorageService } from '../services/config-storage.service';
import * as appActions from './app.actions';
import * as appSelectors from './app.selectors';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { AppConfig } from '../models/app-config.model';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { selectRecognizeSpeechLanguage } from '../modules/settings-store/settings.selectors';
import { TranslateService } from '@ngx-translate/core';
import { RemoteAPIService } from '../services/remote-api.service';
import { MigrationService } from '../services/migration.service';

import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import * as AwesomeFile from '@awesome-cordova-plugins/file';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';


@Injectable()
export class AppEffects {

  appInitialized$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.AppActionsEnum.AppInitialized),
    map(action => appActions.appConfigRestore())
  ));

  startNavigation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        tap(() => {
          this.menuCtrl.close();
        })
      ),
    { dispatch: false }
  );

  navigateBack$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(appActions.AppActionsEnum.NavigateBack),
        tap(() => {
          this.navCtrl.pop();
        })
      ),
    { dispatch: false }
  );

  displayError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(appActions.AppActionsEnum.DisplayError),
        tap(async (action) => {
          console.log('ERROR', JSON.stringify(action.error));
          const toast = await this.toastCtrl.create({
            message: this.translateService.instant("app.errorMessage", {message: action.error}),
            duration: 4000,
          });
          await toast.present();
        })
      ),
    { dispatch: false }
  );

  displayNotification$ = createEffect(() =>
        this.actions$.pipe(
          ofType(appActions.displayNotification),
          tap(async (action) => {
            const toast = await this.toastCtrl.create({
              message: action.message,
              duration: 4000,
            });
            await toast.present();
          })
        )
  , {dispatch: false});

  appConfigStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.AppActionsEnum.AppConfigStore),
      withLatestFrom(this.store.select(appSelectors.selectAppConfig)),
      switchMap(([action, config]) => this.configStorageService.store<AppConfig>("appConfig", config)),
      map(() => appActions.appConfigStoreSucess()),
      catchError((err) => of(appActions.appConfigStoreFailure({ error: err })))
    )
  );
  appConfigStoreFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.AppActionsEnum.AppConfigStoreFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );
  appConfigRestore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.AppActionsEnum.AppConfigRestore),
      switchMap((action) => this.configStorageService.restore<AppConfig>("appConfig")),
      filter((config) => !!config),
      map((config) =>
        appActions.appConfigRestoreSuccess({ appConfig: config })
      ),
      catchError((err) =>
        of(appActions.appConfigRestoreFailure({ error: err }))
      )
    )
  );
  appConfigRestoreFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.AppActionsEnum.AppConfigRestoreFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );

  fileShare$ = createEffect(() => 
      this.actions$.pipe(
        ofType(appActions.AppActionsEnum.FileShare),
        switchMap(async (action) => {
          let sharingRes = await this.socialSharing.share(null, null, action.uri, null);
          return action.uri;
        }),
        map((uri) => appActions.fileShareSuccess({uri: uri})),
        catchError((err) => of(appActions.fileShareFailure(err)))
      )
  );
  fileShareFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.AppActionsEnum.FileShareFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );

  recognizeSpeech$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.AppActionsEnum.RecognizeSpeech),
    withLatestFrom(this.store.select(appSelectors.selectIsRecognizeSpeechAvailable)),
    switchMap(async ([action, isRecognizeSpeechAvailable]) => {
      if (isRecognizeSpeechAvailable) {   
        SpeechRecognition.hasPermission().then(res => {
          if (!res.permission) {
            SpeechRecognition.requestPermission().then(
              (value: void) => {
                this.store.dispatch(appActions.recognizeSpeechProcess());
              }, 
              (reason: any) => {this.store.dispatch(appActions.recognizeSpeechFailure({error: {message: String(reason)}}));}
            );
          } else {
            this.store.dispatch(appActions.recognizeSpeechProcess());
          }
        });
      } else {
        this.store.dispatch(appActions.recognizeSpeechFailure({error: {message: this.translateService.instant("app.recognitionDoNotAvailable")}}));
      }
    })
  ), {dispatch: false});
  recognizeSpeechProcess$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.AppActionsEnum.RecognizeSpeechProcess),
    withLatestFrom(this.store.select(selectRecognizeSpeechLanguage)),
    switchMap(async ([action, recognizeSpeechLanguage]) => {
      this.store.dispatch(appActions.displayNotification({message: this.translateService.instant("app.notifyRecognitionStarted"), mode: 'Info'}));
      SpeechRecognition.start({
        language: recognizeSpeechLanguage,
        maxResults: 256,
        prompt: this.translateService.instant("app.recognitionWindowTitle"),
        partialResults: true,
        popup: false,
      });
    }),
  ), {dispatch: false});

  checkUpdates$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.AppActionsEnum.CheckUpdates),
    switchMap(() => {
      return this.remoteAPIService.getLatestAppVersion().pipe(
        map((lastVersion) => appActions.checkUpdatesSuccess({lastVersion})),
        catchError((err) => of(appActions.checkUpdatesFailure({ error: err })))
      );
    }),
  ));
  checkUpdatesSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.AppActionsEnum.CheckUpdatesSuccess),
    withLatestFrom(this.store.select(appSelectors.selectAppVersion)),
    switchMap(async ([action, appVersion]) => {
      if (this.migrationService.isVersionANewerThanB(action.lastVersion.versionNumber, appVersion)) {
        const confirmPromiseAction = this.alertController
            .create({
              message: this.translateService.instant("app.notifyNewVersionAvailable", {lastVersion: action.lastVersion.versionNumber, appVersion: appVersion}),
              buttons: [
                {
                  text: this.translateService.instant("common.cancel"),
                  role: 'cancel',
                  cssClass: 'secondary',
                },
                {
                  text: this.translateService.instant("app.btnUpdate"),
                  role: 'ok',
                },
              ],
            })
            .then((alert) => alert.present().then(() => alert.onDidDismiss()))
            .then(async (res) => {
              if (res.role === 'ok') {
                

                let fileName = this.remoteAPIService.getAppVersionFileName(action.lastVersion);
                let nativeFilePath = AwesomeFile.File.dataDirectory + fileName;           
                
                const fileTransfer: FileTransferObject = this.transfer.create();
                this.store.dispatch(appActions.binariesDownload());
                fileTransfer.download(
                  this.remoteAPIService.getDownloadLinkForAppVersion(action.lastVersion), 
                  nativeFilePath
                ).then((entry) => {
                  this.store.dispatch(appActions.binariesDownloadSuccess({filePath: entry.toURL()}));
                }).catch((error) => {
                  this.store.dispatch(appActions.binariesDownloadFailure({ error: JSON.stringify(error) }));
                });

              }
            });

      } else {
        this.store.dispatch(appActions.displayNotification({message: this.translateService.instant("app.notifyLastVersionInstalled"), mode: 'Info'}));
      }
    }),
  ), {dispatch: false});
  checkUpdatesFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.AppActionsEnum.CheckUpdatesFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );

  binariesDownloadSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.AppActionsEnum.BinariesDownloadSuccess),
    switchMap(async ({filePath}) => {
      this.fileOpener.open(
        filePath,
        'application/vnd.android.package-archive'
      ).then((success) => {
      }, (err) => {
      });
    })
  ), {dispatch: false});
  binariesDownloadFailure$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.AppActionsEnum.BinariesDownloadFailure),
    map((action) => appActions.displayError({ error: action.error }))
  ));

  constructor(
    private actions$: Actions<appActions.AppActionsUnion>,
    private configStorageService: ConfigStorageService,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private store: Store,
    private socialSharing: SocialSharing,
    private translateService: TranslateService,
    private remoteAPIService: RemoteAPIService,
    private migrationService: MigrationService,
    private alertController: AlertController,
    private transfer: FileTransfer,
    private fileOpener: FileOpener
  ) {}
}
