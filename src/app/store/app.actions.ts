import { createAction, props, union } from '@ngrx/store';
import { AppConfig } from '../models/app-config.model';

export enum AppActionsEnum {
  /** Отобразить ошибку */
  DisplayError = '[App] DisplayError',

  /** Отобразить уведомление */
  DisplayNotification = '[App] DisplayNotification',

  /** Кнопка Обратно */
  NavigateBack = '[App] NavigateBack',

  /** Сохранение конфигурации */
  AppConfigStore = '[App] AppConfigStore',
  AppConfigStoreSuccess = '[App] AppConfigStore Success',
  AppConfigStoreFailure = '[App] AppConfigStore Failure',
  /** Восстановление конфигурации */
  AppConfigRestore = '[App] AppConfigRestore',
  AppConfigRestoreSuccess = '[App] AppConfigRestore Success',
  AppConfigRestoreFailure = '[App] AppConfigRestore Failure',

  /** Шарить файл */
  FileShare = '[App] FileShare',
  FileShareSuccess = '[App] FileShare Success',
  FileShareFailure = '[App] FileShare Failure',

  /** Распознать голос */
  RecognizeSpeech = '[App] RecognizeSpeech',
  RecognizeSpeechSuccess = '[App] RecognizeSpeech Success',
  RecognizeSpeechFailure = '[App] RecognizeSpeech Failure',
  RecognizeSpeechAvailable = '[App] RecognizeSpeech Available',
  RecognizeSpeechProcess = '[App] RecognizeSpeech Process',

  /** Определена локаль системы по умолчанию */
  DiscoveredPreferredLanguage = '[App] DiscoveredPreferredLanguage',

  /** Сохранение в store версии приложения */
  SetAppVersion = '[App] SetAppVersion',

  /** Проверка обновлений приложения */
  CheckUpdates = '[App] CheckUpdates'
}

export const displayError = createAction(
  AppActionsEnum.DisplayError,
  props<{ error: any }>()
);

export const displayNotification = createAction(
  AppActionsEnum.DisplayNotification,
  props<{message: any, mode: 'Success' | 'Info'}>()
);

export const navigateBack = createAction(AppActionsEnum.NavigateBack);

export const appConfigStore = createAction(AppActionsEnum.AppConfigStore);
export const appConfigStoreSucess = createAction(
  AppActionsEnum.AppConfigStoreSuccess
);
export const appConfigStoreFailure = createAction(
  AppActionsEnum.AppConfigStoreFailure,
  props<{ error: any }>()
);
export const appConfigRestore = createAction(AppActionsEnum.AppConfigRestore);
export const appConfigRestoreSuccess = createAction(
  AppActionsEnum.AppConfigRestoreSuccess,
  props<{ appConfig: AppConfig }>()
);
export const appConfigRestoreFailure = createAction(
  AppActionsEnum.AppConfigRestoreFailure,
  props<{ error: any }>()
);

export const fileShare = createAction(
  AppActionsEnum.FileShare,
  props<{uri: string}>()
);
export const fileShareSuccess = createAction(
  AppActionsEnum.FileShareSuccess,
  props<{uri: string}>()
);
export const fileShareFailure = createAction(
  AppActionsEnum.FileShareFailure,
  props<{error: any}>()
)

export const recognizeSpeech = createAction(
  AppActionsEnum.RecognizeSpeech
);
export const recognizeSpeechSuccess = createAction(
  AppActionsEnum.RecognizeSpeechSuccess,
  props<{ recognizedText: string }>()
);
export const recognizeSpeechFailure = createAction(
  AppActionsEnum.RecognizeSpeechFailure,
  props<{error: any}>()
);
export const recognizeSpeechAvailable = createAction(
  AppActionsEnum.RecognizeSpeechAvailable,
  props<{isRecognizeSpeechAvailable: boolean, availableLanguages: string[]}>()
);
export const recognizeSpeechProcess = createAction(
  AppActionsEnum.RecognizeSpeechProcess
);

export const discoveredPreferredLanguage = createAction(
  AppActionsEnum.DiscoveredPreferredLanguage,
  props<{lng: string}>()
);

export const setAppVersion = createAction(
  AppActionsEnum.SetAppVersion,
  props<{appVersion: string}>()
);

export const checkUpdates = createAction(
  AppActionsEnum.CheckUpdates
);

const all = union({
  displayError,
  displayNotification,
  navigateBack,
  appConfigStore,
  appConfigStoreSucess,
  appConfigStoreFailure,
  appConfigRestore,
  appConfigRestoreSuccess,
  appConfigRestoreFailure,
  fileShare,
  fileShareSuccess,
  fileShareFailure,
  recognizeSpeech,
  recognizeSpeechSuccess,
  recognizeSpeechFailure,
  recognizeSpeechAvailable,
  recognizeSpeechProcess,
  discoveredPreferredLanguage,
  setAppVersion,
  checkUpdates
});

export type AppActionsUnion = typeof all;
