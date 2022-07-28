import { createFeatureSelector, createSelector } from "@ngrx/store";
import { selectPreferredLanguage } from "src/app/store/app.selectors";
import { featureKey, ISettingsState } from "./settings.state";

export const selectSettingsState = createFeatureSelector<ISettingsState>(featureKey);

export const selectIsHideCompletedTasks = createSelector(
  selectSettingsState,
  (state: ISettingsState) => !!state ? state.isHideCompletedTasks : false
);
export const selectRecognizeSpeechLanguage = createSelector(
  selectSettingsState,
  selectPreferredLanguage,
  (settingsState: ISettingsState, preferredLanguage: string) => !!settingsState && !!settingsState.recognizeSpeechLanguage  ? settingsState.recognizeSpeechLanguage : preferredLanguage
);
export const selectAvailableUILanguages = createSelector(
  selectSettingsState,
  (state: ISettingsState) => !!state ? state.availableUILanguages : []
);
export const selectUILanguage = createSelector(
  selectSettingsState,
  selectPreferredLanguage,
  (state: ISettingsState, prefferedLanguage: string) => !!state ? (state.uiLanguage || prefferedLanguage) : null
);
export const selectisRecognitionWhenAdding = createSelector(
  selectSettingsState,
  (state: ISettingsState) => !!state ? state.isRecognitionWhenAdding : false
);
