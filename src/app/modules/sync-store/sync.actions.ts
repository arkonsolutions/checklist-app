import { createAction, props, union } from "@ngrx/store";
import { SyncProviderKeyEnum } from "./model/sync-provider-key.enum";

export enum SyncActionsEnum {
  Initialize = '[Sync] Initialize',
  InitializeSuccess = '[Sync] Initialize Success',
  ToggleProviderEnabled = '[Sync] Toggle provider Enabled',
  EnableProvider = '[Sync] Enable provider',
  EnableProviderSuccess = '[Sync] Enable provider Success',
  EnableProviderFailure = '[Sync] Enable provider Failure',
  DisableProvider = '[Sync] Disable provider',
  DisableProviderSuccess = '[Sync] Disable provider Success',
  DisableProviderFailure = '[Sync] Disable provider Failure',
  OpenProviderSettings = '[Sync] Open provider settings',
  ExportData = '[Sync] Export data',
  ExportDataProcess = '[Sync] Export data Process',
  ExportDataSuccess = '[Sync] Export data Success',
  ExportDataFailure = '[Sync] Export data Failure',
  ImportData = '[Sync] Import data',
  ImportDataDismiss = '[Sync] Import data Dismiss',
  ImportDataProcess = '[Sync] Import data Process',
  ImportDataSuccess = '[Sync] Import data Success',
  ImportDataFailure = '[Sync] Import data Failure'
}

export const initialize = createAction(
  SyncActionsEnum.Initialize
);
export const initializeSuccess = createAction(
  SyncActionsEnum.InitializeSuccess,
  props<{ providers: SyncProviderKeyEnum[] }>()
);

export const toggleProviderEnabled = createAction(
  SyncActionsEnum.ToggleProviderEnabled,
  props<{ provider: SyncProviderKeyEnum }>()
);
export const enableProvider = createAction(
  SyncActionsEnum.EnableProvider,
  props<{ provider: SyncProviderKeyEnum }>()
);
export const enableProviderSuccess = createAction(
  SyncActionsEnum.EnableProviderSuccess,
  props<{ provider: SyncProviderKeyEnum }>()
);
export const enableProviderFailure = createAction(
  SyncActionsEnum.EnableProviderFailure,
  props<{ provider: SyncProviderKeyEnum, error: any }>()
);
export const disableProvider = createAction(
  SyncActionsEnum.DisableProvider,
  props<{ provider: SyncProviderKeyEnum }>()
);
export const disableProviderSuccess = createAction(
  SyncActionsEnum.DisableProviderSuccess,
  props<{ provider: SyncProviderKeyEnum }>()
);
export const disableProviderFailure = createAction(
  SyncActionsEnum.DisableProviderFailure,
  props<{ provider: SyncProviderKeyEnum, error: any }>()
);
export const openProviderSettings = createAction(
  SyncActionsEnum.OpenProviderSettings,
  props<{ provider: SyncProviderKeyEnum }>()
);

export const exportData = createAction(
  SyncActionsEnum.ExportData
)
export const exportDataProcess = createAction(
  SyncActionsEnum.ExportDataProcess
)
export const exportDataSuccess = createAction(
  SyncActionsEnum.ExportDataSuccess,
  props<{uri: string}>()
)
export const exportDataFailure = createAction(
  SyncActionsEnum.ExportDataFailure,
  props<{error: any}>()
)
export const importData = createAction(
  SyncActionsEnum.ImportData
)
export const importDataDismiss = createAction(
  SyncActionsEnum.ImportDataDismiss
)
export const importDataProcess = createAction(
  SyncActionsEnum.ImportDataProcess
)
export const importDataSuccess = createAction(
  SyncActionsEnum.ImportDataSuccess
)
export const importDataFailure = createAction(
  SyncActionsEnum.ImportDataFailure,
  props<{error: any}>()
)

const all = union({
  initialize,
  initializeSuccess,
  toggleProviderEnabled,
  enableProvider,
  enableProviderSuccess,
  enableProviderFailure,
  disableProvider,
  disableProviderSuccess,
  disableProviderFailure,
  openProviderSettings,
  exportData,
  exportDataProcess,
  exportDataSuccess,
  exportDataFailure,
  importData,
  importDataDismiss,
  importDataProcess,
  importDataSuccess,
  importDataFailure
});

export type SyncActionsUnion = typeof all;