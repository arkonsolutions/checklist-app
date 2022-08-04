/*eslint-disable eqeqeq*/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { CheckListService } from './check-list.service';
import { ICheckListItem } from './model/check-list-item.model';

const STORAGE_KEY = 'checklist';

@Injectable()
export class CheckListLocalstorageService extends CheckListService {

  private get storage(): ICheckListItem[] {
    let val = localStorage.getItem(STORAGE_KEY);
    return (!!val && val.length > 0) ?
      JSON.parse(localStorage.getItem(STORAGE_KEY)) as ICheckListItem[]
      : [];
  }
  private set storage(val: ICheckListItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  }

  public getChildren(
    parentId: string,
    exceptIds: string[],
    skipDone: boolean = false
  ): Observable<ICheckListItem[]> {
    return of(this.storage).pipe(
      map((data) => data.filter((itm) => itm.parentId == parentId).map(itm => {
        let children = this.storage.filter(si => si.parentId === itm.id);
        return {
          ...itm, 
          childrenCount: children.length,
          childrenDone: children.filter(c => c.isDone).length
        };
      }))
    );
  }
  public getItemWithParentBranch(id: string, skipDone: boolean = false): Observable<ICheckListItem[]> {
    let branch: ICheckListItem[] = [];
    let items = this.storage;
    let target = items.find(itm => itm.id === id);
    if (!!target) {
      do {
        branch.push(target);
        target = items.find(itm => itm.id === target.parentId);
      } while (!!target && !!target.id);
    }

    return of(branch.map(itm => {
      let children = items.filter(si => si.parentId === itm.id);
      return {
        ...itm, 
        childrenCount: children.length,
        childrenDone: children.filter(c => c.isDone).length
      };
    }));
  }

  public getItemWithChildrenTree(id: string, skipDone: boolean = false, nestingLevel?: number): Observable<ICheckListItem[]> {

    let items = this.storage;

    function getAllChildren(id: string) {
      let result = [];
      let children = items.filter(itm => itm.parentId === id);
      children.forEach((itm, idx, arr) => {
        result.push(itm);
        let itmChildren = getAllChildren(itm.id);
        if (itmChildren.length > 0)
          result.push(...itmChildren);
      });

      return result.map(itm => {
        let children = items.filter(si => si.parentId === itm.id);
        return {
          ...itm, 
          childrenCount: children.length,
          childrenDone: children.filter(c => c.isDone).length
        };
      });
    }

    let result: ICheckListItem[] = [];
    let target = items.find(itm => itm.id === id);
    if (!!target) {
      result = [target, ...getAllChildren(target.id)]
    }
    
    return of(result.map(itm => {
      let children = this.storage.filter(si => si.parentId === itm.id);
      return {
        ...itm, 
        childrenCount: children.length,
        childrenDone: children.filter(c => c.isDone).length
      };
    }));
  }

  public setItemIsDone(
    affectedItems: ICheckListItem[]
  ): Observable<any> {
    let result = this.storage.map(si => {
      let ai = affectedItems.find(ai => ai.id === si.id);
      return ai || si;
    });
    this.storage = result;

    return of(result);
  }
  public createItems(items: ICheckListItem[]): Observable<ICheckListItem[]> {
    this.storage = [...this.storage, ...items];
    return of(items);
  }

  public editItem(item: ICheckListItem, affectedItems: ICheckListItem[]): Observable<ICheckListItem> {
    let result = this.storage.map(si => {
      let ai = affectedItems.find(ai => ai.id === si.id);
      return ai || si;
    }).map(si => {
      return si.id === item.id
        ? item
        : si;
    });
    this.storage = result;
    return of(item);
  }

  public removeItem(item: ICheckListItem, affectedItems: ICheckListItem[]): Observable<any> {
    let result = this.storage.map(si => {
      let ai = affectedItems.find(ai => ai.id === si.id);
      return ai || si;
    }).filter(si => si.id != item.id);
    this.storage = result;
    return of(item);
  }
}
