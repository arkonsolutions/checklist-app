import { createReducer, on } from '@ngrx/store';
import * as appActions from './app.actions';
import * as appState from './app.state';

export const reducer = createReducer(
  appState.initialState,
  on(appActions.appConfigRestoreSuccess, (state, { appConfig }) => ({
    ...state,
    ...appConfig,
  })),

  on(appActions.recognizeSpeechAvailable, (state, {isRecognizeSpeechAvailable, availableLanguages}) => ({
    ...state,
    isRecognizeSpeechAvailable: isRecognizeSpeechAvailable,
    recognizeSpeechAvailableLanguages: availableLanguages
  })),

  on(appActions.discoveredPreferredLanguage, (state, {lng}) => ({
    ...state,
    preferredLanguage: lng
  })),

  on(appActions.onLineStatusChanged, (state, {isOnLine}) => ({
    ...state,
    isOnLine: isOnLine
  })),


  on(appActions.setAppVersion, (state, {appVersion}) => ({
    ...state,
    appVersion: appVersion
  })),

  on(appActions.checkUpdates, (state) => ({
    ...state,
    isCheckUpdatesProcess: true
  })),
  on(appActions.checkUpdatesSuccess, (state) => ({
    ...state,
    isCheckUpdatesProcess: false
  })),
  on(appActions.checkUpdatesFailure, (state) => ({
    ...state,
    isCheckUpdatesProcess: false
  })),

  on(appActions.binariesDownload, (state) => ({
    ...state,
    isBinariesDownloadProcess: true
  })),
  on(appActions.binariesDownloadSuccess, (state) => ({
    ...state,
    isBinariesDownloadProcess: false
  })),
  on(appActions.binariesDownloadFailure, (state) => ({
    ...state,
    isBinariesDownloadProcess: false
  }))
);
