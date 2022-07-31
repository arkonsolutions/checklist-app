export const featureKey = 'settings';

export interface ISettingsState {
  isHideCompletedTasks: boolean;
  recognizeSpeechLanguage: string;
  uiLanguage: string;
  availableUILanguages: [string, string][],
  isRecognitionWhenAdding: boolean;
  isCheckUpdatesAtStartup: boolean;
}

export const initialState = {
  isHideCompletedTasks: false,
  recognizeSpeechLanguage: null,
  uiLanguage: null,
  availableUILanguages: [
    ["ru-RU", "Русский"],
    ["en-US", "English"]
  ],
  isRecognitionWhenAdding: false,
  isCheckUpdatesAtStartup: false
} as ISettingsState;