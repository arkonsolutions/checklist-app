import { createFeatureSelector, createSelector } from "@ngrx/store";
import { featureKey, ISyncState } from "./sync.state";

export const selectSyncState = createFeatureSelector<ISyncState>(featureKey);

export const selectProviders = createSelector(
  selectSyncState,
  (state: ISyncState) => !!state ? state.providers : []
);

export const selectIsExportDataProcess = createSelector(
  selectSyncState,
  (state: ISyncState) => !!state ? state.isExportDataProcess : false
);

export const selectIsImportDataProcess = createSelector(
  selectSyncState,
  (state: ISyncState) => !!state ? state.isImportDataProcess : false
);