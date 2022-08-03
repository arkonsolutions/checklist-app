/*eslint-disable eqeqeq*/
import { createReducer, on } from '@ngrx/store';
import { CheckListConfig } from '../models/check-list-config.model';
import * as checklistActions from './check-lists.actions';
import { initialCheckListState } from './check-lists.state';

export const checklistReducer = createReducer(
  initialCheckListState,
  on(checklistActions.getItemWithParentBranchRequest, (state, { id }) => ({
    ...state,
    isItemWithParentBranchLoadingFor: [
      ...state.isItemWithParentBranchLoadingFor,
      id,
    ],
  })),
  on(
    checklistActions.getItemWithParentBranchRequestSuccess,
    (state, { id, items }) => {
      items = !!items ? items : [];
      const newIds = items.map((itm) => itm.id);
      const result = {
        ...state,
        isItemWithParentBranchLoadingFor:
          state.isItemWithParentBranchLoadingFor.filter((val) => val != id),
        loadedItems: [
          ...state.loadedItems.filter(
            (itm) => !newIds.find((newItmId) => newItmId === itm.id)
          ), //старые версии отбрасываются
          ...items,
        ],
      };
      return result;
    }
  ),
  on(
    checklistActions.getItemWithParentBranchRequestFailure,
    (state, { id, error }) => ({
      ...state,
      isItemWithParentBranchLoadingFor:
        state.isItemWithParentBranchLoadingFor.filter((val) => val !== id),
    })
  ),

  on(checklistActions.getChildrenItemsRequest, (state, { id }) => ({
    ...state,
    isChildrenLoadingFor: [...state.isChildrenLoadingFor, id],
  })),
  on(
    checklistActions.getChildrenItemsRequestSuccess,
    (state, { id, items }) => {
      const newIds = items.map((itm) => itm.id);
      const result = {
        ...state,
        isChildrenLoadingFor: state.isChildrenLoadingFor.filter(
          (val) => val != id
        ),
        loadedItems: [
          ...state.loadedItems
            .filter(
              (loadedItm) => !newIds.find((newId) => newId == loadedItm.id)
            ) //старые версии отбрасываются
            .map((loadedItm) =>
              !id && !loadedItm.id //for root item set up initial child count
                ? {
                    ...loadedItm,
                    childrenCount: items.length,
                    childrenDone: items.filter((subItm) => subItm.isDone)
                      .length,
                  }
                : loadedItm
            ), //for root item set up initial child count
          ...items,
        ],
      };
      return result;
    }
  ),
  on(
    checklistActions.getChildrenItemsRequestFailure,
    (state, { id, error }) => ({
      ...state,
      isChildrenLoadingFor: state.isChildrenLoadingFor.filter(
        (val) => val != id
      ),
    })
  ),

  on(checklistActions.createItemSave, (state, { item, affectedItems }) => ({
    ...state,
    isCreateItemSaving: true,
    loadedItems: [
      ...state.loadedItems.map(li => {
        let liAsAffected = affectedItems.find(ai => ai.id === li.id);
        return !!liAsAffected ? liAsAffected : li;
      }), 
      item
    ]
  })),
  on(checklistActions.createItemSaveSuccess, (state, { item }) => ({
    ...state,
    isCreateItemSaving: false,
  })),
  on(checklistActions.createItemSaveFailure, (state, { item, error, affectedItems }) => ({
    ...state,
    isCreateItemSaving: false,
    loadedItems: state.loadedItems.filter(li => li.id != item.id).map(li => {
      let liAsAffected = affectedItems.find(ai => ai.id === li.id);
      let restoredItem = !!liAsAffected ? liAsAffected : li; //restore back reverted affected
      return restoredItem;      
    })
  })),

  on(checklistActions.editItemSave, (state, { item, modifiedItemData, affectedItems }) => ({
    ...state,
    isEditItemSaving: true,
    loadedItems: state.loadedItems.map(li => {
      if (li.id == modifiedItemData.id) 
        return modifiedItemData;
      else
        return li;
    })
  })),
  on(checklistActions.editItemSaveSuccess, (state, { item, modifiedItemData }) => ({
    ...state,
    isEditItemSaving: false
  })),
  on(checklistActions.editItemSaveFailure, (state, { item, modifiedItemData, error }) => ({
    ...state,
    isEditItemSaving: false,
    loadedItems: state.loadedItems.map(li => {
      if (!!item && (li.id == item.id)) {
        return item;
      } else {
        return li;
      }
    })
  })),


  on(checklistActions.removeItemSave, (state, { item, affectedItems }) => ({
    ...state,
    isRemoveItemSaving: true,
    loadedItems: state.loadedItems.filter(li => li.id != item.id).map(li => {
      let liAsAffected = affectedItems.find(ai => ai.id === li.id);
      return !!liAsAffected ? liAsAffected : li;
    })
  })),
  on(checklistActions.removeItemSaveSuccess, (state, { item }) => ({
    ...state,
    isRemoveItemSaving: false
  })),
  on(checklistActions.removeItemSaveFailure, (state, { item, affectedItems, error }) => ({
    ...state,
    isRemoveItemSaving: false,
    loadedItems: [...state.loadedItems.map(li => {
      let liAsAffected = affectedItems.find(ai => ai.id === li.id);
      return !!liAsAffected ? liAsAffected : li;
    }), item]
  })),



  on(checklistActions.setConfigIsShowDetailsToggle, (state) => ({
    ...state,
    config: { ...state.config, isShowDetails: !state.config.isShowDetails },
  })),

  on(checklistActions.configRestoreSuccess, (state, { config }) => ({
    ...state,
    config: { ...(config as CheckListConfig) },
  })),

  on(
    checklistActions.setItemIsDoneSave,
    (state, { id, date, isDoneValue, affectedItems }) => ({
      ...state,
      loadedItems: state.loadedItems.map(li => {
        let liAsAffected = affectedItems.find(ai => ai.id === li.id);
        return !!liAsAffected ? liAsAffected : li;
      })
    })
  ),
  on(
    checklistActions.setItemIsDoneSaveFailure,
    (state, { error, affectedItems }) => ({
      ...state,
      loadedItems:state.loadedItems.map(li => {
        let liAsAffected = affectedItems.find(ai => ai.id === li.id);
        return !!liAsAffected ? liAsAffected : li;
      })
    })
  ),


  on(
    checklistActions.replicateCheckList,
    (state, {id, replicaTo}) => ({
      ...state,
      isReplicateGraphLoading: true
    })
  ),
  on(
    checklistActions.replicateCheckListLoadGraphSuccess,
    (state, {id, replicaTo}) => ({
      ...state,
      isReplicateGraphLoading: false
    })
  ),
  on(
    checklistActions.replicateCheckListLoadGraphFailure,
    (state, {id, replicaTo}) => ({
      ...state,
      isReplicateGraphLoading: false
    })
  ),
  on(
    checklistActions.replicateCheckListSave,
    (state, payload) => ({
      ...state,
      isReplicateSaving: true
    })
  ),
  on(
    checklistActions.replicateCheckListSaveSuccess,
    (state, payload) => ({
      ...state,
      loadedItems: [...state.loadedItems, ...payload.createdItems],
      isReplicateSaving: false
    })
  ),
  on(
    checklistActions.replicateCheckListSaveFailure,
    (state, payload) => ({
      ...state,
      isReplicateSaving: false
    })
  ),

  on(
    checklistActions.reloadCache,
    (state, payload) => ({
      ...state,
      loadedItems: state.loadedItems.filter(li => li.id == null).map(rootItem => ({
        ...rootItem,
        childrenCount: null,
        childrenDone: null
      }))
    })
  ),

  on(
    checklistActions.shareTarget,
    (state, payload) => ({
      ...state,
      isShareTargetGraphLoading: true
    })
  ),
  on(
    checklistActions.shareTargetLoadGraphSuccess,
    (state, payload) => ({
      ...state,
      isShareTargetGraphLoading: false
    })
  ),
  on(
    checklistActions.shareTargetLoadGraphFailure,
    (state, payload) => ({
      ...state,
      isShareTargetGraphLoading: false
    })
  )
);