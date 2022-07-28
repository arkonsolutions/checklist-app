import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataBaseService, StatementData } from '../data-base-service/data-base.service';
import { CheckListService } from './check-list.service';
import { ICheckListItem } from './model/check-list-item.model';
@Injectable()
export class CheckListDBService extends CheckListService {
  
  constructor(private dbService: DataBaseService) {
    super();
  }

  getChildren(
    parentId: string,
    exceptIds: string[],
    skipDone: boolean = false
  ): Observable<ICheckListItem[]> {
    return this.dbService.isDbReady.pipe(
      switchMap(async (isReady) => {
        if (!isReady) {
          return [];
        } else {
          const doneCondition = skipDone ? " and isDone = 0" : "";
          const statement = `SELECT * FROM [CheckList_Aggregated] WHERE parentId ${
            !!parentId ? '= ?' : 'IS NULL'
          }${doneCondition}`;
          const statementResult = await this.dbService
            .executeSql({statement, args: [...(!!parentId ? [String(parentId)] : [])]})
            .then((res) => {
              const result: ICheckListItem[] = [];
              for (let i = 0; i < res.rows.length; i++) {
                const item = res.rows.item(i);
                // do something with it
                result.push(item as ICheckListItem);
              }
              return result;
            });
          return [...statementResult];
        }
      })
    );
  }

  getItemWithParentBranch(id: string, skipDone: boolean = false): Observable<ICheckListItem[]> {
    return this.dbService.isDbReady.pipe(
      switchMap(async (isReady) => {
        if (!isReady) {
          return null;
        } else {
          const doneCondition = skipDone ? "and isDone = 0" : "";
          const statement = `
                  WITH RECURSIVE parent_tree(id, parentId)
                  AS (
                      SELECT id, parentId from [CheckList_Aggregated] where id = ? ${doneCondition}
                      UNION ALL
                      SELECT cla.id, cla.parentId FROM [CheckList_Aggregated] AS cla INNER JOIN parent_tree pt ON pt.parentId = cla.id
                  )
                  SELECT * FROM parent_tree AS pt
                  LEFT JOIN [CheckList_Aggregated] AS cla USING (id)`;
          return await this.dbService.executeSql({statement, args:[String(id)]});
        }
      }),
      map((sqlRes: any) => {
        const result: ICheckListItem[] = [];
        for (let i = 0; i < sqlRes.rows.length; i++) {
          result.push(sqlRes.rows.item(i));
        }
        return result;
      })
    );
  }

  public getItemWithChildrenTree(id: string, skipDone: boolean = false): Observable<ICheckListItem[]> {
    return this.dbService.isDbReady.pipe(
      switchMap(async (isReady) => {
        if (!isReady) {
          return null;
        } else {
          const doneCondition = skipDone ? "and isDone = 0" : "";
          const statement = `
            WITH RECURSIVE children_tree(id, parentId)
            AS (
                SELECT id, parentId from [CheckList_Aggregated] where id = ? ${doneCondition}
                UNION ALL
                SELECT cla.id, cla.parentId FROM [CheckList_Aggregated] AS cla INNER JOIN children_tree ct ON ct.id = cla.parentId
            )
            SELECT * FROM children_tree AS ct
            LEFT JOIN [CheckList_Aggregated] AS cla USING (id)`;
          return await this.dbService.executeSql({statement, args:[String(id)]});
        }
      }),
      map((sqlRes: any) => {
        const result: ICheckListItem[] = [];
        for (let i = 0; i < sqlRes.rows.length; i++) {
          result.push(sqlRes.rows.item(i));
        }
        return result;
      })
    );
  }

  setItemIsDone(affectedItems: ICheckListItem[]): Observable<any> {
    return this.dbService.isDbReady.pipe(
      switchMap(async (isReady) => {
        if (!isReady) {
          return null;
        } else {
          let statements = this.generateStatementsForChecklistUpdate(affectedItems);
          const statementResult = await this.dbService.executeBatch(statements);
          return statementResult;
        }
      })
    );
  }

  createItems(items: ICheckListItem[], affectedItems: ICheckListItem[]): Observable<ICheckListItem[]> {
    return this.dbService.isDbReady.pipe(
      switchMap(async (isReady) => {
        if (!isReady) {
          return null;
        } else {
          let insertStatements: StatementData[] = items.map(itm => {
            return {
              statement: 'INSERT INTO [CheckList] (id, parentId, title, description, isDone, isTemplate) VALUES (?, ?, ?, ?, ?, ?)',
              args: [
                String(itm.id),
                !!itm.parentId ? String(itm.parentId) : null,
                String(itm.title),
                !!itm.description ? String(itm.description) : null,
                itm.isDone ? 1 : 0,
                itm.isTemplate ? 1 : 0
              ]
            } as StatementData
          });

          let statements = this.generateStatementsForChecklistUpdate(affectedItems);
          const statementResult = await this.dbService.executeBatch([...statements, ...insertStatements]);
          return [ ...items ];
        }
      })
    );
  }

  public editItem(item: ICheckListItem, affectedItems: ICheckListItem[]): Observable<ICheckListItem> {
    return this.dbService.isDbReady.pipe(
      switchMap(async (isReady) => {
        if (!isReady) {
          return null;
        } else {
          let statements = this.generateStatementsForChecklistUpdate([...affectedItems, item]);
          const statementResult = await this.dbService.executeBatch(statements);
          return { statementResult };
        }
      })
    );
  }

  public removeItem(item: ICheckListItem, affectedItems: ICheckListItem[]): Observable<any> {
    return this.dbService.isDbReady.pipe(
      switchMap(async (isReady) => {
        if (!isReady) {
          return null;
        } else {
          let removeStatement = {
            statement: 'DELETE FROM [CheckList] WHERE id = ?',
            args: [
              String(item.id),
            ]
          } as StatementData;
          let statements = this.generateStatementsForChecklistUpdate(affectedItems);
          const statementResult = await this.dbService.executeBatch([...statements, removeStatement]);
          return { ...item };
        }
      })
    );
  }

  private generateStatementsForChecklistUpdate(items: ICheckListItem[]): StatementData[] {
    return !!items ? 
      items.map(itm => {
        return {
          statement: 'UPDATE [CheckList] SET isTemplate = ?, title = ?, description = ?, dueDate = ?, isDone = ?, isDoneDate = ? WHERE id = ?',
          args: [itm.isTemplate ? 1 : 0, itm.title, itm.description, itm.dueDate, itm.isDone ? 1 : 0, itm.isDoneDate, itm.id]
        } as StatementData;
      })
      : [];
  }
}
