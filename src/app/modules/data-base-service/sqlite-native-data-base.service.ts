/* eslint-disable no-param-reassign, no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
// let SQLite: any;
// type SQLiteObject = {executeSql};

import { take } from 'rxjs/operators';
import { DataBaseService, StatementData } from './data-base.service';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';

const DB_NAME = 'CheckList.sqlite';

@Injectable()
export class SqliteNativeDataBaseService extends DataBaseService {
  
  public importFileToDb(fileData: string): Promise<any> {

    //return this.sqlitePorter.importSqlToDb(this.db, fileData);

    const instructions = fileData.split(';');
    return this.db.transaction((fx) => {
      instructions.forEach((instr, idx, arr) => {
        instr = instr.trim().replace(`\\n`, '').replace('"', '');
        if (instr.length > 0) {
          fx.executeSql(instr.trim(), []);
        }
      });
    });
  }

  public exportDbToFile(): Promise<any> {
    return this.sqlitePorter.exportDbToSql(this.db).then(res => {
      return this.postrocessExportedDBData(res);
    });
  }

  private postrocessExportedDBData(fileData: string): string {
    let statements = fileData.substring(fileData.indexOf('INSERT'), fileData.length);
    return statements;
  }

  private db: SQLiteObject;

  constructor(
    private http: HttpClient,
    private sqlitePorter: SQLitePorter
  ) {
    super();
  }

  public initialize(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      SQLite.create({
        name: DB_NAME,
        location: 'default',
      })
        .then((db: SQLiteObject) => {
          this.http
            .get('assets/scheme.sql', { responseType: 'text' })
            .pipe(take(1))
            .subscribe((schemeText) => {
              const instructions = schemeText.split(';');
              return db
                .transaction((fx) => {
                  instructions.forEach((instr, idx, arr) => {
                    instr = instr.trim();
                    if (instr.length > 0) {
                      fx.executeSql(instr.trim(), []);
                    }
                  });
                })
                .then(() => {
                  this.db = db;
                  console.log('DB Initialized');
                  this._isDbReady.next(true);
                  resolve();
                })
                .catch((e) => {
                  console.log(e);
                  reject();
                });
            });
        })
        .catch((e) => {
          console.log(e);
          reject();
        });
    });
  }

  public executeSql(statementData: StatementData): Promise<any> {
    return this.db.executeSql(statementData.statement, statementData.args);
  }

  public executeBatch(statementsData: StatementData[]): Promise<any> {
    return this.db.transaction(function(tx) {
      statementsData.forEach((stItm, stIdx, stArr) => {
        tx.executeSql(stItm.statement, stItm.args, (tx, results) => {
          //result handling
        });
      });
    });
  }
}
