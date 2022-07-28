/* eslint-disable no-param-reassign, no-underscore-dangle */
import { BehaviorSubject } from 'rxjs';


export interface StatementData {
  statement: string,
  args?: any[]
}


export abstract class DataBaseService {
  public isDbReady;
  protected _isDbReady = new BehaviorSubject(false);

  constructor() {
    this.isDbReady = this._isDbReady.asObservable();
  }

  public abstract initialize(): Promise<void>;
  public abstract executeSql(statementData: StatementData): Promise<any>;
  public abstract executeBatch(statementsData: StatementData[]): Promise<any>;
  public abstract importFileToDb(fileData: string): Promise<any>;
  public abstract exportDbToFile(): Promise<string>;
}
