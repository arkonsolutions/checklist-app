import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as appState from './app.state';

export const selectAppState = createFeatureSelector<appState.State>(
  appState.featureKey
);

export const selectAppConfig = createSelector(
  selectAppState,
  (state: appState.State) => (!!state ? state.appConfig : null)
);

export const selectPreferredLanguage = createSelector(
  selectAppState,
  (state: appState.State) => !!state ? state.preferredLanguage : null
);
export const selectIsRecognizeSpeechAvailable = createSelector(
  selectAppState,
  (state: appState.State) => !!state ? state.isRecognizeSpeechAvailable : false
);
export const selectRecognizeSpeechAvailableLanguages = createSelector(
  selectAppState,
  (state: appState.State) => !!state ? state.recognizeSpeechAvailableLanguages : []
);
export const selectAppVersion = createSelector(
  selectAppState,
  (state: appState.State) => !!state ? state.appVersion : null
);
export const selectIsCheckUpdatesProcess = createSelector(
  selectAppState,
  (state: appState.State) => !!state ? state.isCheckUpdatesProcess : false
);