import { createReducer, on } from "@ngrx/store";
import * as settingsState from './settings.state';
import * as settingsActions from './settings.actions';

export const settingsReducer = createReducer(
  settingsState.initialState,
  on(settingsActions.settingsRestoreSuccess, (state, {settingsState}) => ({
    ...settingsState,
  })),
  on(settingsActions.toggleHideCompletedTasks, (state) => ({
    ...state,
    isHideCompletedTasks: !state.isHideCompletedTasks
  })),
  on(settingsActions.selectRecognizeSpeechLanguage, (state, {lng}) => ({
    ...state,
    recognizeSpeechLanguage: lng
  })),
  on(settingsActions.selectUILanguage, (state, {lng}) => ({
    ...state,
    uiLanguage: lng
  })),
  on(settingsActions.toggleRecognitionWhenAdding, (state) => ({
    ...state,
    isRecognitionWhenAdding: !state.isRecognitionWhenAdding
  })),
  on(settingsActions.toggleCheckUpdatesAtStartup, (state) => ({
    ...state,
    isCheckUpdatesAtStartup: !state.isCheckUpdatesAtStartup
  })),
);