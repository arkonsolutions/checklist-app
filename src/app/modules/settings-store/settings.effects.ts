import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as settingsActions from './settings.actions';
import * as settingsSelectors from './settings.selectors';
import * as appActions from '../../store/app.actions';
import * as appSelectors from '../../store/app.selectors';
import * as checkListActions from '../check-lists/store/check-lists.actions';
import { catchError, filter, map, switchMap, withLatestFrom, tap } from "rxjs/operators";
import { of } from "rxjs";
import { ISettingsState } from "./settings.state";
import { ConfigStorageService } from "src/app/services/config-storage.service";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class SettingsEffects {
  
  constructor(
    private actions$: Actions<settingsActions.SettingsActionsUnion>,
    private store: Store,
    private configStorageService: ConfigStorageService,
    private translateService: TranslateService
  ) {}

  appInitialized$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.AppActionsEnum.AppInitialized),
    map(acction => settingsActions.settingsRestore())
  ));

  settingsStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(settingsActions.SettingsActionsEnum.SettingsStore),
      withLatestFrom(this.store.select(settingsSelectors.selectSettingsState)),
      switchMap(([action, config]) => this.configStorageService.store<ISettingsState>("settings", config)),
      map(() => settingsActions.settingsStoreSucess()),
      catchError((err) => of(settingsActions.settingsStoreFailure({ error: err })))
    )
  );
  settingsStoreFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(settingsActions.SettingsActionsEnum.SettingsStoreFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );
  settingsRestore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(settingsActions.SettingsActionsEnum.SettingsRestore),
      switchMap((action) => this.configStorageService.restore<ISettingsState>("settings")),
      filter((config) => !!config),
      map((config) =>
        settingsActions.settingsRestoreSuccess({ settingsState: config })
      ),
      catchError((err) =>
        of(settingsActions.settingsRestoreFailure({ error: err }))
      )
    )
  );
  settingsRestoreSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.SettingsActionsEnum.SettingsRestoreSuccess),
    withLatestFrom(this.store.select(settingsSelectors.selectisCheckUpdatesAtStartup), this.store.select(appSelectors.selectIsUpdateCheckAvailable)),
    tap(async ([action, isCheckUpdatesAtStartup, isUpdateCheckAvailable]) => {
      if (isCheckUpdatesAtStartup && isUpdateCheckAvailable) {
        this.store.dispatch(appActions.checkUpdates());
      }
    })
  ), {dispatch: false});
  settingsRestoreFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(settingsActions.SettingsActionsEnum.SettingsRestoreFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );


  toggleHideCompletedTasks$ = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.toggleHideCompletedTasks),
    switchMap(action => [
      settingsActions.settingsStore(),
      checkListActions.reloadCache()
    ])
  ));
  selectRecognizeSpeechLanguage$ = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.selectRecognizeSpeechLanguage),
    map(action => settingsActions.settingsStore())
  ));
  selectUILanguage$ = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.selectUILanguage),
    switchMap((payload) => this.translateService.use(payload.lng)),
    map(action => settingsActions.settingsStore())
  ));
  toggleRecognitionWhenAdding$ = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.toggleRecognitionWhenAdding),
    map(action => settingsActions.settingsStore())
  ));

  toggleCheckUpdatesAtStartup$ = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.toggleCheckUpdatesAtStartup),
    map(action => settingsActions.settingsStore())
  ));
}