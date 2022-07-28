import { ICheckListItem } from '../../check-list-services/model/check-list-item.model';
import { CheckListConfig } from '../models/check-list-config.model';

/** Режим работы с модулем CheckLists */
export enum CheckListMode {
  /** Работа с чек-листами */
  CheckLists = 0,
  /** Работа с шаблонами */
  Templates = 1
};
export interface ICheckListState {
  /** Загруженные из БД элементы. Плоский список. */
  loadedItems: ICheckListItem[];
  /** Список родительских ID для которых в данный момент загружаются дочерние элементы */
  isChildrenLoadingFor: string[];
  /** Идентификатор элемента, для которого происходит загрузка.
   * В БД запрашивается этот id и вмесмте сним цепочка id вверх по родительской иерархии
   * до самого верха. В данный список попадает только id целевого элемента */
  isItemWithParentBranchLoadingFor: string[];
  /** Запущен запрос на добавление/сохданение элемента в БД */
  isCreateItemSaving: boolean;
  isEditItemSaving: boolean;
  isRemoveItemSaving: boolean;
  isReplicateGraphLoading: boolean;
  isReplicateSaving: boolean;
  /** Конфигурация ui feature-модуля */
  config: CheckListConfig;
}

export const initialCheckListState: ICheckListState = {
  loadedItems: [
    {
      id: null,
      title: 'root',
      description: 'service object',
      isDone: null,
      dueDate: null,
      isDoneDate: null,
      isTemplate: null,
      parentId: null,
      childrenCount: null,
      childrenDone: null,
    }
  ],
  isChildrenLoadingFor: [],
  isItemWithParentBranchLoadingFor: [],
  isCreateItemSaving: false,
  isEditItemSaving: false,
  isRemoveItemSaving: false,
  isReplicateGraphLoading: false,
  isReplicateSaving: false,
  config: {
    isShowDetails: true,
  }
};
