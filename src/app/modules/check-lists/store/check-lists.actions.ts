import { createAction, props, union } from '@ngrx/store';
import { ICheckListItem } from '../../check-list-services/model/check-list-item.model';
import { CheckListConfig } from '../models/check-list-config.model';
import { CheckListMode } from './check-lists.state';

export enum ECheckListActions {
  /** Получить все данные, достаточные для отображения запрошенного элемента */
  EnsureTarget = '[CheckList] EnsureTarget',

  /** Получить целевой элемент и цепочку его родительских элементов */
  EnsureItemWithParentBranchForTarget = '[CheckList] EnsureTargetWithParentBranch for Target',
  GetItemWithParentBranchRequest = '[CheckList] GetTargetWithParentBranchRequest',
  GetItemWithParentBranchRequestSuccess = '[CheckList] GetTargetWithParentBranchRequest Success',
  GetItemWithParentBranchRequestFailure = '[CheckList] GetTargetWithParentBranchRequest Failure',

  /** Получить дочерние элементы. В случае рута, parentId === null. */
  EnsureChildrenItemsForTarget = '[CheckList] EnsureChildrenItems for Target',
  GetChildrenItemsRequest = '[CheckList] GetChildrenItemsRequest',
  GetChildrenItemsRequestSuccess = '[CheckList] GetChildrenItemsRequest Success',
  GetChildrenItemsRequestFailure = '[CheckList] GetChildrenItemsRequest Failure',

  /** Создать элемент */
  CreateItem = '[CheckList] CreateItem',
  CreateItemSave = '[CheckList] CreateItem Save',
  CreateItemSaveSuccess = '[CheckList] CreateItem Save Success',
  CreateItemSaveFailure = '[CheckList] CreateItem Save Failure',

  /** Редактировать текущий элемент */
  EditTarget = '[CheckList] EditTarget',
  /** Редактировать выбранный элемент */
  EditItem = '[CheckList] EditItem',
  EditItemDismiss = '[CheckList] EditItem Dismiss',
  EditItemOK = '[CheckList] EditItem OK',
  EditItemSave = '[CheckList] EditItem Save',
  EditItemSaveSuccess = '[CheckList] EditItem Save Success',
  EditItemSaveFailure = '[CheckList] EditItem Save Failure',

  /** Удалить текущий */
  RemoveTarget = '[CheckList] RemoveTarget',
  RemoveItem = '[CheckList] RemoveItem',
  RemoveItemSave = '[CheckList] RemoveItemSave',
  RemoveItemSaveSuccess = '[CheckList] RemoveItemSaveSuccess',
  RemoveItemSaveFailure = '[CheckList] RemoveItemSaveFailure',

  /** Отобразить родительское дерево текущего элемента */
  PresentTargetParentTree = '[CheckList] PresentTargetParentTree',

  /** Перейти к элементу */
  SwitchTargetTo = '[CheckList] SwitchTargetTo',

  /** Установка конфига isShowDetails */
  SetConfigIsShowDetailsToggle = '[CheckList] SetConfigIsShowDetailsToggle',

  /** Сохранение конфигурации */
  ConfigStore = '[CheckList] ConfigStore',
  ConfigStoreSuccess = '[CheckList] ConfigStore Success',
  ConfigStoreFailure = '[CheckList] ConfigStore Failure',
  /** Восстановление конфигурации */
  ConfigRestore = '[CheckList] ConfigRestore',
  ConfigRestoreSuccess = '[CheckList] ConfigRestore Success',
  ConfigRestoreFailure = '[CheckList] ConfigRestore Failure',

  /** Переключение состояния "Выполнено" для элемента */
  ToggleItemIsDone = '[CheckList] ToggleItemIsDone',
  ToggleItemIsDoneDismiss = '[CheckLists] ToggleItemIsDoneDismiss',
  SetItemIsDoneSave = '[CheckList] SetItemIsDone Save',
  SetItemIsDoneSaveSuccess = '[CheckList] SetItemIsDoneSave Success',
  SetItemIsDoneSaveFailure = '[CheckList] SetItemIsDoneSave Failure',

  /** Копирование/дублирование элемента */
  ReplicateTarget = '[CheckList] ReplicateTarget',
  ReplicateCheckList = '[CheckList] ReplicateCheckList',
  ReplicateCheckListLoadGraphSuccess = '[CheckList] ReplicateCheckList LoadGraph Success',
  ReplicateCheckListLoadGraphFailure = '[CheckList] ReplicateCheckList LoadGraph Failure',
  ReplicateCheckListSave = '[CheckList] ReplicateCheckList Save',
  ReplicateCheckListSaveSuccess = '[CheckList] ReplicateCheckList Save Success',
  ReplicateCheckListSaveFailure = '[CheckList] ReplicateCheckList Save Failure',

  /** Очистить кеш загруженых элементов и перезагрузить текущий. Требуется после импорта данных. */
  ReloadCache = '[CheckList] ReloadCache'
}

export const ensureTarget = createAction(ECheckListActions.EnsureTarget);

export const ensureItemWithParentBranchForTarget = createAction(
  ECheckListActions.EnsureItemWithParentBranchForTarget
);
export const getItemWithParentBranchRequest = createAction(
  ECheckListActions.GetItemWithParentBranchRequest,
  props<{ id: string }>()
);
export const getItemWithParentBranchRequestSuccess = createAction(
  ECheckListActions.GetItemWithParentBranchRequestSuccess,
  props<{ id: string; items: ICheckListItem[] }>()
);
export const getItemWithParentBranchRequestFailure = createAction(
  ECheckListActions.GetItemWithParentBranchRequestFailure,
  props<{ id: string; error: any }>()
);

export const ensureChildrenItemsForTarget = createAction(
  ECheckListActions.EnsureChildrenItemsForTarget,
  props<{ forceReload?: boolean }>()
);
export const getChildrenItemsRequest = createAction(
  ECheckListActions.GetChildrenItemsRequest,
  props<{ id?: string; forceReload?: boolean }>()
);
export const getChildrenItemsRequestSuccess = createAction(
  ECheckListActions.GetChildrenItemsRequestSuccess,
  props<{ id?: string; items: ICheckListItem[] }>()
);
export const getChildrenItemsRequestFailure = createAction(
  ECheckListActions.GetChildrenItemsRequestFailure,
  props<{ id?: string; error: any }>()
);

export const createItem = createAction(
  ECheckListActions.CreateItem,
  props<{modifiedItemData?: ICheckListItem}>()
);
export const createItemSave = createAction(
  ECheckListActions.CreateItemSave,
  props<{ item: ICheckListItem, affectedItems: ICheckListItem[] }>()
);
export const createItemSaveSuccess = createAction(
  ECheckListActions.CreateItemSaveSuccess,
  props<{ item: ICheckListItem }>()
);
export const createItemSaveFailure = createAction(
  ECheckListActions.CreateItemSaveFailure,
  props<{ item: ICheckListItem; error: any, affectedItems: ICheckListItem[] }>()
);

export const editTarget = createAction(
  ECheckListActions.EditTarget
);
export const editItem = createAction(
  ECheckListActions.EditItem,
  props<{item: ICheckListItem, modifiedItemData?: ICheckListItem}>()
);
export const editItemDismiss = createAction(ECheckListActions.EditItemDismiss);
export const editItemOK = createAction(
  ECheckListActions.EditItemOK,
  props<{ item: ICheckListItem, modifiedItemData: ICheckListItem }>()
);
export const editItemSave = createAction(
  ECheckListActions.EditItemSave,
  props<{ item: ICheckListItem; modifiedItemData: ICheckListItem, affectedItems: ICheckListItem[] }>()
);
export const editItemSaveSuccess = createAction(
  ECheckListActions.EditItemSaveSuccess,
  props<{ item: ICheckListItem, modifiedItemData: ICheckListItem }>()
);
export const editItemSaveFailure = createAction(
  ECheckListActions.EditItemSaveFailure,
  props<{ item: ICheckListItem, modifiedItemData: ICheckListItem, error: any }>()
);


export const removeTarget = createAction(
  ECheckListActions.RemoveTarget
);
export const removeItem = createAction(
  ECheckListActions.RemoveItem,
  props<{ item: ICheckListItem }>()
);
export const removeItemSave = createAction(
  ECheckListActions.RemoveItemSave,
  props<{ item: ICheckListItem, affectedItems: ICheckListItem[] }>()
);
export const removeItemSaveSuccess = createAction(
  ECheckListActions.RemoveItemSaveSuccess,
  props<{ item: ICheckListItem }>()
);
export const removeItemSaveFailure = createAction(
  ECheckListActions.RemoveItemSaveFailure,
  props<{ item: ICheckListItem, affectedItems: ICheckListItem[], error: any }>()
);


export const presentTargetParentTree = createAction(
  ECheckListActions.PresentTargetParentTree
);

export const switchTargetTo = createAction(
  ECheckListActions.SwitchTargetTo,
  props<{ id: string, mode?: CheckListMode }>()
);

export const setConfigIsShowDetailsToggle = createAction(
  ECheckListActions.SetConfigIsShowDetailsToggle
);

export const configStore = createAction(ECheckListActions.ConfigStore);
export const configStoreSucess = createAction(
  ECheckListActions.ConfigStoreSuccess
);
export const configStoreFailure = createAction(
  ECheckListActions.ConfigStoreFailure,
  props<{ error: any }>()
);
export const configRestore = createAction(ECheckListActions.ConfigRestore);
export const configRestoreSuccess = createAction(
  ECheckListActions.ConfigRestoreSuccess,
  props<{ config: CheckListConfig }>()
);
export const configRestoreFailure = createAction(
  ECheckListActions.ConfigRestoreFailure,
  props<{ error: any }>()
);

export const toggleItemIsDone = createAction(
  ECheckListActions.ToggleItemIsDone,
  props<{ id: string; date: Date }>()
);
export const toggleItemIsDoneDismiss = createAction(
  ECheckListActions.ToggleItemIsDoneDismiss,
  props<{ id: string; date: Date }>()
);
export const setItemIsDoneSave = createAction(
  ECheckListActions.SetItemIsDoneSave,
  props<{ id: string; date: Date; isDoneValue: boolean; affectedItems: ICheckListItem[] }>()
);
export const setItemIsDoneSaveSuccess = createAction(
  ECheckListActions.SetItemIsDoneSaveSuccess,
  props<{ id: string; date: Date; isDoneValue: boolean, affectedItems: ICheckListItem[] }>()
);
export const setItemIsDoneSaveFailure = createAction(
  ECheckListActions.SetItemIsDoneSaveFailure,
  props<{ error: any; affectedItems: ICheckListItem[] }>()
);

export const replicateTarget = createAction(
  ECheckListActions.ReplicateTarget
);
export const replicateCheckList = createAction(
  ECheckListActions.ReplicateCheckList,
  props<{ id: string, replicaTo: CheckListMode }>()
);
export const replicateCheckListLoadGraphSuccess = createAction(
  ECheckListActions.ReplicateCheckListLoadGraphSuccess,
  props<{ id: string, replicaTo: CheckListMode, loadedItems: ICheckListItem[] }>()
);
export const replicateCheckListLoadGraphFailure = createAction(
  ECheckListActions.ReplicateCheckListLoadGraphFailure,
  props<{ id: string, replicaTo: CheckListMode, error: any }>()
);
export const replicateCheckListSave = createAction(
  ECheckListActions.ReplicateCheckListSave,
  props<{ id: string, replicaTo: CheckListMode, replicaId: string, itemsForCreate: ICheckListItem[] }>()
);
export const replicateCheckListSaveSuccess = createAction(
  ECheckListActions.ReplicateCheckListSaveSuccess,
  props<{ id: string, replicaTo: CheckListMode, replicaId: string, createdItems: ICheckListItem[] }>()
);
export const replicateCheckListSaveFailure = createAction(
  ECheckListActions.ReplicateCheckListSaveFailure,
  props<{ id: string, replicaTo: CheckListMode, replicaId: string, itemsForCreate: ICheckListItem[], error: any }>()
);

export const reloadCache = createAction(
  ECheckListActions.ReloadCache
);

const all = union({
  ensureTarget,
  ensureItemWithParentBranchForTarget,
  getItemWithParentBranchRequest,
  getItemWithParentBranchRequestSuccess,
  getItemWithParentBranchRequestFailure,
  ensureChildrenItemsForTarget,
  getChildrenItemsRequest,
  getChildrenItemsRequestSuccess,
  getChildrenItemsRequestFailure,
  createItem,
  createItemSave,
  createItemSaveSuccess,
  createItemSaveFailure,
  editTarget,
  editItem,
  editItemDismiss,
  editItemOK,
  editItemSave,
  editItemSaveSuccess,
  editItemSaveFailure,
  removeTarget,
  removeItem,
  removeItemSave,
  removeItemSaveSuccess,
  removeItemSaveFailure,
  presentTargetParentTree,
  switchTargetTo,
  setConfigIsShowDetailsToggle,
  configStore,
  configStoreSucess,
  configStoreFailure,
  configRestore,
  configRestoreSuccess,
  configRestoreFailure,
  toggleItemIsDone,
  toggleItemIsDoneDismiss,
  setItemIsDoneSave,
  setItemIsDoneSaveSuccess,
  setItemIsDoneSaveFailure,
  replicateTarget,
  replicateCheckList,
  replicateCheckListLoadGraphSuccess,
  replicateCheckListLoadGraphFailure,
  replicateCheckListSave,
  replicateCheckListSaveSuccess,
  replicateCheckListSaveFailure,
  reloadCache
});

export type CheckListActionsUnion = typeof all;
