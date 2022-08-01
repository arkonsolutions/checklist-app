import { AppConfig } from '../models/app-config.model';

export const featureKey = 'app';

export interface State {
  appConfig: AppConfig;
  appVersion: string;
  preferredLanguage: string;
  isRecognizeSpeechAvailable: boolean;
  recognizeSpeechAvailableLanguages: string[];
  isCheckUpdatesProcess: boolean;
  isBinariesDownloadProcess: boolean;
}

export const initialState: State = {
  appConfig: {
    theme: null,
  },
  appVersion: null,
  preferredLanguage: null,
  isRecognizeSpeechAvailable: false,
  recognizeSpeechAvailableLanguages: [],
  isCheckUpdatesProcess: false,
  isBinariesDownloadProcess: false
};
