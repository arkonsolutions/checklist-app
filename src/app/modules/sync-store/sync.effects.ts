import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { SyncProviderService } from "./services/sync-provider.service";
import * as appActions from '../../store/app.actions';
import * as syncActions from './sync.actions';
import * as checkListActions from '../check-lists/store/check-lists.actions';
import { selectProviders } from "./sync.selectors";
import { ISyncProviderState } from "./sync.state";
import { Router } from "@angular/router";
import { AlertController, ToastController } from "@ionic/angular";
import { DataBaseService } from "../data-base-service/data-base.service";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SyncEffects implements OnInitEffects {
  
  constructor(
    private actions$: Actions<syncActions.SyncActionsUnion>,
    private store: Store,
    private router: Router,
    @Inject(SyncProviderService) private providersServices: SyncProviderService<any>[],
    private alertController: AlertController,
    private dbService: DataBaseService,
    private fileChooser: FileChooser,
    private translateService: TranslateService
  ) {}

  ngrxOnInitEffects(): Action {
    return syncActions.initialize();
  }

  initialize$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.initialize),
    switchMap(() => of(this.providersServices.map(ps => ps.providerKey))),
    map(providers => syncActions.initializeSuccess({ providers }))
  ));


  toggleProviderEnabled$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.toggleProviderEnabled),
    withLatestFrom(this.store.select(selectProviders)),
    map(([payload, providers]) => {
      return providers.find(p => p.key === payload.provider);
    }),
    filter(Boolean),
    mergeMap((targetProvider: ISyncProviderState) => {
      if (targetProvider.isEnabled) {
        return of(syncActions.disableProvider({ provider: targetProvider.key }));
      } else {
        return of(syncActions.enableProvider({ provider: targetProvider.key }));
      }
    })
  ));


  enableProvider$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.enableProvider),
    map((payload) => this.providersServices.find(ps => ps.providerKey === payload.provider)),
    filter(args => !!args),
    mergeMap(targetService => targetService.checkConnection().pipe(
      map(() => syncActions.enableProviderSuccess({ provider: targetService.providerKey })),
      catchError(error => {
        return of(syncActions.enableProviderFailure({ provider: targetService.providerKey, error: error }));
      })
    ))
  ));
  enableProviderFailure$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.enableProviderFailure),
    map(args => appActions.displayError({ error: args.error }))
  ));


  disableProvider$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.disableProvider),
    map((payload) => this.providersServices.find(ps => ps.providerKey === payload.provider)),
    filter(args => !!args),
    mergeMap(targetService => targetService.stopActivity().pipe(
      map(() => syncActions.disableProviderSuccess({ provider: targetService.providerKey })),
      catchError(error => {
        return of(syncActions.disableProviderFailure({ provider: targetService.providerKey, error: error }));
      })
    ))
  ));
  disableProviderFailure$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.disableProviderFailure),
    map(args => appActions.displayError({ error: args.error }))
  ));

  openProviderSettings$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.openProviderSettings),
    tap((payload) => {
      this.router.navigate(['settings/sync-provider', payload.provider]);
    })
  ), {dispatch: false});

  exportData$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.exportData),
    mergeMap(async (action) => {
      const confirmPromiseAction = this.alertController
            .create({
              message: this.translateService.instant("sync.confirmExport"),
              buttons: [
                {
                  text: this.translateService.instant("common.cancel"),
                  role: 'cancel',
                  cssClass: 'secondary',
                },
                {
                  text: this.translateService.instant("common.yes"),
                  role: 'ok',
                },
              ],
            })
            .then((alert) => alert.present().then(() => alert.onDidDismiss()))
            .then((res) => {
              if (res.role === 'ok') {
                this.store.dispatch(syncActions.exportDataProcess());
              }
            });
    })
  ), {dispatch: false});
  exportDataProcess$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.exportDataProcess),
    switchMap(async (action) => {
      try {
        let jsonString = await this.dbService.exportDbToFile();
        let date = new Date();
        let jsonFilePath = `checklist_${date.getFullYear()}_${date.getUTCMonth()}_${date.getUTCDay()}_${date.getUTCHours()}_${date.getUTCMinutes()}_${date.getUTCSeconds()}.snapshot`;

        let saveRes = await Filesystem.writeFile({
          path: jsonFilePath,
          data: jsonString,
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        });
        
        this.store.dispatch(syncActions.exportDataSuccess({uri: saveRes.uri}));
      } catch (error: any) {
        this.store.dispatch(syncActions.exportDataFailure({error: error}));
      }
    })
  ), {dispatch: false});
  exportDataSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.exportDataSuccess),
    switchMap(async (action) => {
      const confirmPromiseAction = this.alertController
        .create({
          message: this.translateService.instant("sync.confirmShare"),
          buttons: [
            {
              text: this.translateService.instant("common.no"),
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: this.translateService.instant("sync.share"),
              role: 'ok',
            },
          ],
        })
        .then((alert) => alert.present().then(() => alert.onDidDismiss()))
        .then((res) => {
          if (res.role === 'ok') {
            this.store.dispatch(appActions.fileShare({uri: action.uri}));
          }
        });
    })
  ), {dispatch: false})
  exportDataFailure$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.exportDataFailure),
    map(args => appActions.displayError({ error: args.error }))
  ));

  importData$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.importData),
    mergeMap(async () => {
      const confirmPromiseAction = this.alertController
            .create({
              message: this.translateService.instant("sync.specifyFileLocation"),
              buttons: [
                {
                  text: this.translateService.instant("common.cancel"),
                  role: 'cancel',
                  cssClass: 'secondary',
                },
                {
                  text: this.translateService.instant("common.ok"),
                  role: 'ok',
                },
              ],
            })
            .then((alert) => alert.present().then(() => {
              this.store.dispatch(syncActions.importDataDismiss());
              return alert.onDidDismiss()
            }))
            .then((res) => {
              if (res.role === 'ok') {
                this.store.dispatch(syncActions.importDataProcess());
              }
            });
    })
  ), {dispatch: false});
  importDataProcess$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.importDataProcess),
    mergeMap(async () => {
      this.fileChooser.open()
        .then(async uri => {
          let readRes = await Filesystem.readFile({
            path: uri,
            encoding: Encoding.UTF8
          });
          return this.dbService.importFileToDb(JSON.stringify(readRes.data)).then(res => {
            this.store.dispatch(syncActions.importDataSuccess());
          }).catch(e => {
            this.store.dispatch(syncActions.importDataFailure({error: e}));
          });
        })
        .catch(e => this.store.dispatch(syncActions.importDataFailure({error: e})));
    })
  ), {dispatch: false});
  importDataFailure$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.importDataFailure),
    map(args => appActions.displayError({ error: args.error }))
  ));
  importDataSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(syncActions.importDataSuccess),
    mergeMap(async () => {
      this.store.dispatch(appActions.displayNotification({message: this.translateService.instant("sync.importSuccsessfuly"), mode: "Success"}));
      this.store.dispatch(checkListActions.reloadCache());
    })
  ), {dispatch: false});
}