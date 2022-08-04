import { Injectable } from '@angular/core';
import { time } from 'console';
import { EMPTY, Observable, of } from 'rxjs';
import { CheckListConfig } from '../check-lists/models/check-list-config.model';
import { ICheckListItem } from './model/check-list-item.model';

const CONFIG_STORE_KEY = 'CheckList_config';
@Injectable()
export abstract class CheckListService {
  

  /**
  * Вычисление обновлённого состояния элементов родительского дерева, в результате изменения данных в целевом элементе. Данный пересчёт происходит в бизнес-логике. От использования триггеров в БД для пересчёта было решено отказаться для повышения отзывчивости приложения.
  * @param loadedItems набор элементов, включающий, целевой элемент и всю цепочку его родителей.
  * @param itemId 
  * @param date 
  * @param requestedIsDoneValue Новое значение (то, на которое должно смениться текущее) поля isDone для элемента itemId. Если не задано, то вычисляется текущее на основе childCount == childDouneCount. Используется напр. для родительского элемента удаляемого элемента.
  * @param forceWithSameItemValue Пересчёт производится начиная с существующего элемента созраняющего своё isDone значения. Производится для пересчёта девера родительських с вновь добавленными в список значениями. Или при пересчёте дерева вверх начиная с родительского, при удалении одного из его дочерних.
  * @returns Возвращает множество затронутых изменением над целевым элементом элементов. Его можно использовать в транзакции изменений в БД, так и в редюсере обновляющем UI. Отсутствующее значение используется для пересчёта веток родительских элементов, коллекция children которых была изменена (создание/удаление).
  */
  calculateAffectedChanges(loadedItems: ICheckListItem[], itemId: string, date: Date, requestedIsDoneValue: boolean, forceWithSameItemValue: boolean): ICheckListItem[] {
    var result: ICheckListItem[] = [];
    
    let itemWithParentsTreeItems = this.takeItemWithParentsBranch(loadedItems, itemId);
    result = this.recalculateParentsIsDone(itemWithParentsTreeItems, itemId, date, requestedIsDoneValue, forceWithSameItemValue);

    return result;
  }

  /** Элементы, данные в которых были изменены в результате удаления указанного элемента */
  calculateAffectedWhenRemoving(loadedItems: ICheckListItem[], idForRemove: string, date: Date): ICheckListItem[] {
    let targetItem = loadedItems.find(itm => itm.id === idForRemove);
    let parentOf = loadedItems.find(itm => itm.id === targetItem.parentId);
    let updatedParentOf = {
      ...parentOf,
      childrenCount: parentOf.childrenCount - 1,
      childrenDone: targetItem.isDone ? parentOf.childrenDone - 1 : parentOf.childrenDone
    } as ICheckListItem;

    //set done date if not been not done
    if (!parentOf.isDone && updatedParentOf.childrenCount === updatedParentOf.childrenDone) {
      updatedParentOf.isDone = true;
      updatedParentOf.isDoneDate = date;
    } else {
      updatedParentOf.isDoneDate = null;
    }

    let newItemsSet = [
      ...loadedItems.filter(itm => itm.id !== idForRemove && itm.id !== parentOf.id),
      updatedParentOf
    ];
    return this.calculateAffectedChanges(newItemsSet, updatedParentOf.id, updatedParentOf.isDoneDate, updatedParentOf.isDone, true);
  };

  /** Элементы, данные в которых были изменены в результате добавления элемента */
  calculateAffectedWhenAdding(loadedItems: ICheckListItem[], newItem: ICheckListItem): ICheckListItem[] {
    let parentOf = loadedItems.find(itm => itm.id === newItem.parentId);
    let updatedParentOf = {
      ...parentOf,
      childrenCount: parentOf.childrenCount + 1,
      childrenDone: newItem.isDone ? parentOf.childrenDone + 1 : parentOf.childrenDone
    } as ICheckListItem;

    let newItemsSet = [
      ...loadedItems.filter(itm => itm.id !== parentOf.id),
      updatedParentOf,
      newItem
    ];
    return this.calculateAffectedChanges(newItemsSet, newItem.id, newItem.isDoneDate, newItem.isDone, true);
  };


  /**
 *
  Пройти всю ветку вверх.
  Инкрементировать/Декрементировать childrenDone.
  В случае равенства с childrenCount выставить isDone=true. В случае неравенства выставить isDone=false.
 *
 * @param items
 * @param itemId
 * @param date
 * @param isDoneValue
 */
private recalculateParentsIsDone = (
  items: ICheckListItem[],
  itemId: string,
  date: Date,
  requestedIsDoneValue: boolean,
  forceWithSameItemValue: boolean //Пересчитать даже если значение элемента соотв. новому - заребованному. Такое бывает, когда элемент уже есть в списке, но нужно привести в соответствие счётчики childrenDone его родительского.
): ICheckListItem[] => {
  let parentId;
  /** Сменяется ли состояние isDone у элемента. Если не сменяется, проход дерева ввверх прекращается. */
  let itemStateChanged = false;
  let result: ICheckListItem[] = items.map((itm) => {
    if (itm.id === itemId) {
      parentId = itm.parentId;
      itemStateChanged = itm.isDone !== requestedIsDoneValue;
      
      //Обновлять значения isDone и isDoneDate только если у элемента было противоположное isDone значение.
      if (itemStateChanged || forceWithSameItemValue) {
        return {
          ...itm,
          isDone: requestedIsDoneValue,
          isDoneDate: requestedIsDoneValue ? date : null,
        };
      } else {
        return itm;
      }
    } else {
      return itm;
    }
  });

  // Эсли состояние элемента сменяется, пересчитывается chidrenDone и isDone у его родительского элемента.
  if (!!parentId && (itemStateChanged || forceWithSameItemValue)) {
    /** isDone родительского элемента снимается всегда, но устанавливается только, если все дочерние выполнены. */
    let needForRecalculateParentDoneState = false;
    let allChildrenIsDone = false;
    result = result.map((itm) => {
      let itmCopy = {...itm};
      if (itmCopy.id === parentId) {
        let newChildrenDone = itmCopy.childrenDone;
        if (itemStateChanged) { //Если у существующего ранее элемента был изменён признак isDone - пересчитать childrenDone для его parent.
          newChildrenDone = !!requestedIsDoneValue
            ? itmCopy.childrenDone + 1
            : itmCopy.childrenDone - 1;
        } else if (!!forceWithSameItemValue) { //Если элемент вновь добавленный
          if (!!requestedIsDoneValue) { //То изменять childrenDone parent'а, только если элемент добавлен со значением isDone == true
            newChildrenDone = itmCopy.childrenDone++;
          }
        }
        
        allChildrenIsDone = newChildrenDone === itm.childrenCount;
        needForRecalculateParentDoneState = !requestedIsDoneValue || allChildrenIsDone;
        return {
          ...itmCopy,
          childrenDone: newChildrenDone,
        };
      } else {
        return itmCopy;
      }
    });

    if (needForRecalculateParentDoneState) {
      result = this.recalculateParentsIsDone(result, parentId, date, requestedIsDoneValue, false); //false - т.к. родители более высшего порядка будут переститаны только по необходимости.
    }
  }

  return result;
};


/** Собрать строку для педедачи чек-листа в виде текстового сообщения */
public humanizeChecklist(rootItemId: string, items: ICheckListItem[]): string {
  let serializedGraph = "";

  const serializeItem = (indent: number, item: ICheckListItem): string => {
    let result = '  '.repeat(indent)+`* ${item.title}\n`;
    const children = items.filter(itm => itm.parentId === item.id);
    children.forEach((cItm, cIdx, cArr) => {
      result += serializeItem(indent + 1, cItm);
    });
    return result;
  }

  if (!!rootItemId) {
    const rootItem = items.find(itm => itm.id == rootItemId);
    if (!!rootItem) {
      serializedGraph = serializeItem(0, rootItem);
    }
  } else {
    const rootItems = items.filter(itm => itm.parentId == rootItemId);
    rootItems.forEach((rItm, rIdx, rArr) => {
      serializedGraph += serializeItem(0, rItm);
    });
  }
  
  
  return serializedGraph;
}


  /** Получить элемент и список элементов цепочки родительских. */
  takeItemWithParentsBranch(items: ICheckListItem[], itemId: string): ICheckListItem[] {
    let result: ICheckListItem[] = [];
    let targetId = itemId;
    let target: ICheckListItem = null;
    do {
      target = items.find(itm => itm.id === targetId);
      if (!!target) {
        result.push(target);
        targetId = target.parentId;
      } else {
        targetId = null;
      }
    } while (!!targetId)
    return result;
  }

  storeConfig(config: CheckListConfig): Observable<any> {
    localStorage.setItem(CONFIG_STORE_KEY, JSON.stringify(config));
    return EMPTY;
  }

  restoreConfig(): Observable<CheckListConfig> {
    const config = JSON.parse(localStorage.getItem(CONFIG_STORE_KEY));
    return of(config as CheckListConfig);
  }

  /**
   *
   * @param parentId
   * Идентификатор, который должен быть родительским у запрашиваемыэ элементов.
   * @param exceptIds
   * Идентификаторы элементов, которые следует исключить из результата. Они были загружены ранее.
   * @returns
   */
  public abstract getChildren(
    parentId: string,
    exceptIds: string[],
    skipDone: boolean
  ): Observable<ICheckListItem[]>;

  public abstract getItemWithParentBranch(
    id: string,
    skipDone: boolean
  ): Observable<ICheckListItem[]>;

  public abstract getItemWithChildrenTree(
    id: string,
    skipDone: boolean,
    nestingLevel?: number
  ): Observable<ICheckListItem[]>

  public abstract setItemIsDone(
    affectedItems: ICheckListItem[]
  ): Observable<any>;

  public abstract createItems(
    items: ICheckListItem[],
    affectedItems: ICheckListItem[]
  ): Observable<ICheckListItem[]>;

  public abstract editItem(
    item: ICheckListItem,
    affectedItems: ICheckListItem[]
  ): Observable<ICheckListItem>;

  public abstract removeItem(
    item: ICheckListItem,
    affectedItems: ICheckListItem[]
  ): Observable<any>;
}
