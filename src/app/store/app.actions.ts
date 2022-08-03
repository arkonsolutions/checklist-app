import { createAction, props, union } from '@ngrx/store';
import { AppConfig } from '../models/app-config.model';
import { IAppVersion } from '../models/app-version.interface';

export enum AppActionsEnum {
  /** Приложение инициализированно */
  AppInitialized = '[App] Initialized',

  /** Изменился статус подключения к интернет */
  OnLineStatusChanged = '[App] OnLineStatusChanged',

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
  SocialShare = '[App] SocialShare',
  SocialShareSuccess = '[App] SocialShare Success',
  SocialShareFailure = '[App] SocialShare Failure',

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
  CheckUpdates = '[App] CheckUpdates',
  CheckUpdatesSuccess = '[App] CheckUpdates Success',
  CheckUpdatesFailure = '[App] CheckUpdates Failure',

  /** Скачивание дистрибутива с обновлением */
  BinariesDownload = '[App] BinariesDownload',
  BinariesDownloadSuccess = '[App] BinariesDownload Success',
  BinariesDownloadFailure = '[App] BinariesDownload Failure',
}

export const appInitialized = createAction(
  AppActionsEnum.AppInitialized
);

export const onLineStatusChanged = createAction(
  AppActionsEnum.OnLineStatusChanged,
  props<{ isOnLine: boolean }>()
);

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

export const socialShare = createAction(
  AppActionsEnum.SocialShare,
  props<{subject?: string, message?: string, fileUri?: string}>()
);
export const socialShareSuccess = createAction(
  AppActionsEnum.SocialShareSuccess,
  props<{subject?: string, message?: string, fileUri?: string}>()
);
export const socialShareFailure = createAction(
  AppActionsEnum.SocialShareFailure,
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
export const checkUpdatesSuccess = createAction(
  AppActionsEnum.CheckUpdatesSuccess,
  props<{ lastVersion: IAppVersion }>()
);
export const checkUpdatesFailure = createAction(
  AppActionsEnum.CheckUpdatesFailure,
  props<{error: any}>()
);

export const binariesDownload = createAction(
  AppActionsEnum.BinariesDownload
);
export const binariesDownloadSuccess = createAction(
  AppActionsEnum.BinariesDownloadSuccess,
  props<{ filePath: string }>()
);
export const binariesDownloadFailure = createAction(
  AppActionsEnum.BinariesDownloadFailure,
  props<{error: any}>()
);

const all = union({
  appInitialized,
  onLineStatusChanged,
  displayError,
  displayNotification,
  navigateBack,
  appConfigStore,
  appConfigStoreSucess,
  appConfigStoreFailure,
  appConfigRestore,
  appConfigRestoreSuccess,
  appConfigRestoreFailure,
  socialShare,
  socialShareSuccess,
  socialShareFailure,
  recognizeSpeech,
  recognizeSpeechSuccess,
  recognizeSpeechFailure,
  recognizeSpeechAvailable,
  recognizeSpeechProcess,
  discoveredPreferredLanguage,
  setAppVersion,
  checkUpdates,
  checkUpdatesSuccess,
  checkUpdatesFailure,
  binariesDownload,
  binariesDownloadSuccess,
  binariesDownloadFailure
});

export type AppActionsUnion = typeof all;
