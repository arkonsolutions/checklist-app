import { createAction, props, union } from "@ngrx/store";
import { ISettingsState } from "./settings.state";

export enum SettingsActionsEnum {
  /** Сохранение конфигурации */
  SettingsStore = '[Settings] SettingsStore',
  SettingsStoreSuccess = '[Settings] SettingsStoreSuccess',
  SettingsStoreFailure = '[Settings] SettingsStoreFailure',
  /** Восстановление конфигурации */
  SettingsRestore = '[Settings] SettingsRestore',
  SettingsRestoreSuccess = '[Settings] SettingsRestoreSuccess',
  SettingsRestoreFailure = '[Settings] SettingsRestoreFailure',

  ToggleHideCompletedTasks = '[Settings] ToggleHideCompletedTasks',
  SelectRecognizeSpeechLanguage = '[Settings] SelectRecognizeSpeechLanguage',
  SelectUILanguage = '[Settings] SelectUILanguage',
  ToggleRecognitionWhenAdding = '[Settings] ToggleRecognitionWhenAdding',

  ToggleCheckUpdatesAtStartup = '[Settings] ToggleCheckUpdatesAtStartup',
}

export const settingsStore = createAction(SettingsActionsEnum.SettingsStore);
export const settingsStoreSucess = createAction(
  SettingsActionsEnum.SettingsStoreSuccess
);
export const settingsStoreFailure = createAction(
  SettingsActionsEnum.SettingsStoreFailure,
  props<{ error: any }>()
);
export const settingsRestore = createAction(SettingsActionsEnum.SettingsRestore);
export const settingsRestoreSuccess = createAction(
  SettingsActionsEnum.SettingsRestoreSuccess,
  props<{ settingsState: ISettingsState }>()
);
export const settingsRestoreFailure = createAction(
  SettingsActionsEnum.SettingsRestoreFailure,
  props<{ error: any }>()
);

export const toggleHideCompletedTasks = createAction(
  SettingsActionsEnum.ToggleHideCompletedTasks
);
export const selectRecognizeSpeechLanguage = createAction(
  SettingsActionsEnum.SelectRecognizeSpeechLanguage,
  props<{lng: string}>()
);
export const selectUILanguage = createAction(
  SettingsActionsEnum.SelectUILanguage,
  props<{lng: string}>()
);
export const toggleRecognitionWhenAdding = createAction(
  SettingsActionsEnum.ToggleRecognitionWhenAdding
);

export const toggleCheckUpdatesAtStartup = createAction(
  SettingsActionsEnum.ToggleCheckUpdatesAtStartup
);

const all = union({
  settingsStore,
  settingsStoreSucess,
  settingsStoreFailure,
  settingsRestore,
  settingsRestoreSuccess,
  settingsRestoreFailure,
  toggleHideCompletedTasks,
  selectRecognizeSpeechLanguage,
  selectUILanguage,
  toggleRecognitionWhenAdding,
  toggleCheckUpdatesAtStartup
});

export type SettingsActionsUnion = typeof all;