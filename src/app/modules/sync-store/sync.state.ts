import { SyncProviderKeyEnum } from "./model/sync-provider-key.enum";

export const featureKey = 'sync';

export interface ISyncState {
  providers: ISyncProviderState[];
  isExportDataProcess: boolean;
  isImportDataProcess: boolean;
}

export interface ISyncProviderStatus {
  date: Date;
  message: string;
}
export interface ISyncProviderState {
  key: SyncProviderKeyEnum;
  isEnabled: boolean;
  status: ISyncProviderStatus;
  isEnablingToggleProcess: boolean;
  isSyncProcess: boolean;
}

export const initialState = {
  providers: []
} as ISyncState;