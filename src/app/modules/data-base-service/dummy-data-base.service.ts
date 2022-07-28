/* eslint-disable no-param-reassign, no-underscore-dangle */
import { DataBaseService, StatementData } from './data-base.service';

export class DummyDataBaseService extends DataBaseService {
  public importFileToDb(fileData: any): Promise<any> {
    return Promise.resolve();
  }
  public exportDbToFile(): Promise<any> {
    return Promise.resolve();
  }
  public initialize(): Promise<void> {
    this._isDbReady.next(false);
    return Promise.resolve();
  }
  public executeSql(statementData: StatementData): Promise<any> {
    return Promise.resolve();
  }
  public executeBatch(statementsData: StatementData[]): Promise<any> {
    return Promise.resolve();
  }
}
