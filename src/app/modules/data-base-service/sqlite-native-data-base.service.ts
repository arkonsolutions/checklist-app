/* eslint-disable no-param-reassign, no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
// let SQLite: any;
// type SQLiteObject = {executeSql};

import { take } from 'rxjs/operators';
import { DataBaseService, StatementData } from './data-base.service';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { environment } from 'src/environments/environment';
import { ExchangeSet } from 'src/app/models/exchange-set.model';

const DB_NAME = 'CheckList.sqlite';

@Injectable()
export class SqliteNativeDataBaseService extends DataBaseService {
 
  public importFileToDb(fileData: string): Promise<any> {
    if (fileData.indexOf('AppVersion') === -1) {
      return this.importFileToDbDepricated(fileData);
    } else {
      return this.importFileToDbExchangeSet(JSON.parse(JSON.parse(fileData)) as ExchangeSet);
    }
  }

  private importFileToDbDepricated(fileData: string): Promise<any> {
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

  private importFileToDbExchangeSet(exchangeSet: ExchangeSet): Promise<any> {

    const instructions = [];
    if (!!exchangeSet && !!exchangeSet.CheckList && exchangeSet.CheckList.length > 0) {
      let instStart = "INSERT OR REPLACE INTO [CheckList] (";
      let fieldNames = Object.keys(exchangeSet.CheckList[0]);
      for(let i = 0; i < fieldNames.length; i++) {
        instStart += fieldNames[i];
        if (i < fieldNames.length - 1) {
          instStart += ", "
        }
      }
      instStart += ") VALUES (";

      exchangeSet.CheckList.forEach((itm, idx, arr) => {
        let instruction = instStart;
        for(let i = 0; i < fieldNames.length; i++) {
          let val = itm[fieldNames[i]];
          if (val != null)
            val = `"${val}"`;
          instruction += val;
          if (i < fieldNames.length - 1) {
            instruction += ", "
          }
        }
        instruction += ")";
        instructions.push(instruction);
      });
    }

    return this.db.transaction((fx) => {
      instructions.forEach((instr, idx, arr) => {
        if (instr.length > 0) {
          fx.executeSql(instr, []);
        }
      });
    });
  }

  public exportDbToFile(): Promise<any> {
    let statement = "SELECT * FROM [CheckList]";
    return this.executeSql({statement}).then(sqlRes => {
      let exportObj: ExchangeSet = {
        "AppVersion": environment.appVersion, 
        "CheckList": []
      };
      for (let i = 0; i < sqlRes.rows.length; i++) {
        exportObj.CheckList.push(sqlRes.rows.item(i));
      }
      return JSON.stringify(exportObj);
    });
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
