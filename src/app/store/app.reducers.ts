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

  on(appActions.setAppVersion, (state, {appVersion}) => ({
    ...state,
    appVersion: appVersion
  }))
);
