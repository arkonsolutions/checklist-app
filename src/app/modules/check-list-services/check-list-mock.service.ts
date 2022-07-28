/*eslint-disable eqeqeq*/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { CheckListService } from './check-list.service';
import { ICheckListItem } from './model/check-list-item.model';

const ITEMS_SOURCE = [
  {
    id: "tmp1",
    parentId: null,
    title: 'test template',
    childrenCount: 0,
    childrenDone: 0,
    isDone: false,
    isTemplate: true
  } as ICheckListItem,
  {
    id: "1",
    parentId: null,
    title: 'test parent',
    childrenCount: 2,
    childrenDone: 2,
    isDone: true,
    isTemplate: false
  } as ICheckListItem,
  {
    id: "2",
    parentId: null,
    isTemplate: false,
    title: 'test parent 2',
    childrenCount: 0,
    childrenDone: 0,
  } as ICheckListItem,
  {
    id: "3",
    parentId: "1",
    title: 'test child',
    childrenCount: 1,
    childrenDone: 0,
    isDone: true,
    isTemplate: false
  } as ICheckListItem,
  {
    id: "4",
    parentId: "1",
    title: 'test child',
    childrenCount: 0,
    childrenDone: 0,
    isDone: true,
    isTemplate: false
  } as ICheckListItem,
  {
    id: "5",
    parentId: "3",
    title: 'test subchild',
    childrenCount: 0,
    childrenDone: 0,
    isTemplate: false
  } as ICheckListItem,
];

@Injectable()
export class CheckListMockService extends CheckListService {

  public getChildren(
    parentId: string,
    exceptIds: string[]
  ): Observable<ICheckListItem[]> {
    return of(ITEMS_SOURCE).pipe(
      delay(500),
      map((data) => data.filter((itm) => itm.parentId == parentId))
    );
  }
  public getItemWithParentBranch(id: string): Observable<ICheckListItem[]> {
    let branch: ICheckListItem[] = [];
    let target = ITEMS_SOURCE.find(itm => itm.id === id);
    if (!!target) {
      do {
        branch.push(target);
        target = ITEMS_SOURCE.find(itm => itm.id === target.parentId);
      } while (!!target && !!target.id);
    }

    return of(branch).pipe(delay(500));
  }

  public getItemWithChildrenTree(id: string): Observable<ICheckListItem[]> {

    function getAllChildren(id: string) {
      let result = [];
      let children = ITEMS_SOURCE.filter(itm => itm.parentId === id);
      children.forEach((itm, idx, arr) => {
        result.push(itm);
        let itmChildren = getAllChildren(itm.id);
        if (itmChildren.length > 0)
          result.push(...itmChildren);
      });
      return result;
    }

    let result: ICheckListItem[] = [];
    let target = ITEMS_SOURCE.find(itm => itm.id === id);
    if (!!target) {
      result = [target, ...getAllChildren(target.id)]
    }
    return of(result).pipe(delay(500));
  }

  public setItemIsDone(
    affectedItems: ICheckListItem[]
  ): Observable<any> {
    return of({}).pipe(
      delay(500),
      tap(() => {
        let error = new Error('DBG error!');
        throw error;
      })
    );
  }
  public createItems(items: ICheckListItem[]): Observable<ICheckListItem[]> {
    return of([...items]).pipe(
      delay(500),
      tap(() => {
        // let error = new Error('DBG error!');
        // throw error;
      })
    );
  }

  public editItem(item: ICheckListItem, affectedItems: ICheckListItem[]): Observable<ICheckListItem> {
    return of(item).pipe(
      delay(500),
      tap(() => {
        let error = new Error('DBG error!');
        throw error;
      })
    );
  }

  public removeItem(item: ICheckListItem, affectedItems: ICheckListItem[]): Observable<any> {
    return of(null).pipe(
      delay(500),
      tap(() => {
        let error = new Error('DBG error!');
        throw error;
      })
    );
  }
}
