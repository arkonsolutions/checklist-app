/*eslint-disable eqeqeq*/
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterStateUrl } from 'src/app/models/router-state-url.model';
import { selectRouterInfo } from 'src/app/store/router.selectors';
import { ICheckListItem } from '../../check-list-services/model/check-list-item.model';
import { selectIsHideCompletedTasks } from '../../settings-store/settings.selectors';
import { CheckListMode, ICheckListState } from './check-lists.state';

export const selectCheckListState =
  createFeatureSelector<ICheckListState>('checkList');

export const selectCheckListConfig = createSelector(
  selectCheckListState,
  (state: ICheckListState) => (!!state ? state.config : null)
);

export const selectTargetId = createSelector(
  selectRouterInfo,
  (state: RouterStateUrl) => (!!state ? state.params.id : null)
);

export const selectMode = createSelector(
  selectRouterInfo,
  (state: RouterStateUrl) => {
    let modeValue = (!!state && !!state.queryParams && !!state.queryParams.mode) ? state.queryParams.mode : null;
    return modeValue === 'templates' ? CheckListMode.Templates : CheckListMode.CheckLists;
  }
);

export const selectIsTemplateMode = createSelector(
  selectMode,
  (mode: CheckListMode) => (mode === CheckListMode.Templates)
);

export const selectLoadedItems = createSelector(
  selectCheckListState,
  (state: ICheckListState) => !!state ? state.loadedItems : []
);
export const selectLoadedAvailableItems = createSelector(
  selectLoadedItems,
  selectIsHideCompletedTasks,
  (loadedItems: ICheckListItem[], isHideCompletedTasks: boolean) => loadedItems.filter(li => !li.id || !isHideCompletedTasks || (li.isDone == false))
);
export const selectTarget = createSelector(
  selectTargetId,
  selectLoadedAvailableItems,
  selectIsTemplateMode,
  (targetId, loadedAvailableItems: ICheckListItem[], isTemplateMode: boolean) => {
    return !!loadedAvailableItems
      ? loadedAvailableItems.find((itm) => itm.id == targetId 
          && ((itm.isTemplate == isTemplateMode) || !targetId)
        )
      : null
  }
);
export const selectTargetChildren = createSelector(
  selectTargetId,
  selectLoadedAvailableItems,
  selectIsTemplateMode,
  (targetId, loadedAvailableItems: ICheckListItem[], isTemplateMode) =>
  loadedAvailableItems.filter(
      (itm) => itm.parentId == targetId 
        && !!itm.id //exclude root
        && itm.isTemplate == isTemplateMode
    ).sort((a, b) => {
      let aCmpValue = !!a.isDoneDate ? new Date(a.isDoneDate).getTime() : Number.MAX_SAFE_INTEGER;
      let bCmpValue = !!b.isDoneDate ? new Date(b.isDoneDate).getTime() : Number.MAX_SAFE_INTEGER;
      return bCmpValue - aCmpValue;
    })
);
export const selectIsChildrenLoadingForTarget = createSelector(
  selectTargetId,
  selectCheckListState,
  (targetId, state: ICheckListState) =>
    !!state ? state.isChildrenLoadingFor.filter((itm) => itm == targetId).length > 0 : false
);
export const selectTargetBreadcumbs = createSelector(
  selectTargetId,
  selectCheckListState,
  (targetId, state: ICheckListState) => {
    const result = [];
    let rootReached = false;
    const targetItem = state.loadedItems.find((itm) => itm.id === targetId);
    let currentStepId = !!targetItem ? targetItem.parentId : null;
    do {
      const parentItem = state.loadedItems.find(
        (itm) => itm.id === currentStepId
      );
      if (!!parentItem) {
        result.push(parentItem);
        currentStepId = parentItem.parentId;
        rootReached = !parentItem.id;
      } else {
        rootReached = true;
      }
    } while (!rootReached);

    return result.reverse();
  }
);
export const selectIsItemWithParentBranchLoadingForTarget = createSelector(
  selectTargetId,
  selectCheckListState,
  (targetId, state: ICheckListState) =>
    !!state ? state.isItemWithParentBranchLoadingFor.filter((itm) => itm === targetId)
      .length > 0 : false
);

  export const selectIsReplicateGraphLoading = createSelector(
    selectCheckListState,
    (state: ICheckListState) => (!!state ? state.isReplicateGraphLoading : false)
  );

  export const selectIsReplicateSaving = createSelector(
    selectCheckListState,
    (state: ICheckListState) => (!!state ? state.isReplicateSaving : false)
  )

  export const selectIsCreateItemSaving = createSelector(
    selectCheckListState,
    (state: ICheckListState) => (!!state ? state.isCreateItemSaving : false)
  );

  export const selectIsEditItemSaving = createSelector(
    selectCheckListState,
    (state: ICheckListState) => (!!state ? state.isEditItemSaving : false)
  );

  export const selectIsRemoveItemSaving = createSelector(
    selectCheckListState,
    (state: ICheckListState) => (!!state ? state.isRemoveItemSaving : false)
  );