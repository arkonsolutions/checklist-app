/* eslint-disable no-param-reassign, no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
// import { Device } from "@capacitor/core";
let Device: any;
let CapacitorSQLite: any;
type SQLiteConnection = { createConnection; isDatabase } | any;
let SQLiteConnection: any;
type SQLiteDBConnection = unknown;
type capSQLiteSet = unknown;

import { EMPTY, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { DataBaseService, StatementData } from './data-base.service';

const DB_NAME = 'checkList';
const DB_ENCRYPTED = false;
const DB_MODE = 'no-encryption';
const DB_VERSION = 1;

/**
 * https://github.com/capacitor-community/sqlite
 * https://devdactic.com/sqlite-ionic-app-with-capacitor/
 */
@Injectable()
export class SqliteCapacitorDataBaseService extends DataBaseService {
  
  public importFileToDb(fileData: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  public exportDbToFile(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  private _sqlitePlugin: SQLiteConnection;
  private get sqlitePlugin(): SQLiteConnection {
    if (!this._sqlitePlugin) {
      const sp: any = CapacitorSQLite;
      this._sqlitePlugin = new SQLiteConnection(sp);
    }
    return this._sqlitePlugin;
  }

  constructor(private http: HttpClient) {
    super();
  }

  public async initialize(): Promise<void> {
    const info = await Device.getInfo();
    if (info.operatingSystem === 'android') {
      try {
        const sqlite = CapacitorSQLite as any;
        const res = await sqlite.requestPermissions();
        return this.setupDatabase();
      } catch (e) {
        throw new Error(
          `No DB access. This app can't work without Database access.`
        );
      }
    } else {
      return this.setupDatabase();
    }
  }

  public executeSql(statementData: StatementData): Promise<any> {
    return this._isDbReady
      .pipe(
        switchMap(async (isDbReady) => {
          if (!isDbReady) {
            return of({ values: [] });
          } else {
            const dbConn = await this.sqlitePlugin.createConnection(
              DB_NAME,
              DB_ENCRYPTED,
              DB_MODE,
              DB_VERSION
            );
            if (!!dbConn) {
              await dbConn.open();
              let result = null;
              try {
                result = await dbConn.run(statementData.statement, statementData.args);
              } finally {
                await dbConn.close();
              }
              return result;
            }
          }
        })
      )
      .toPromise();
  }
  public executeBatch(statementsData: StatementData[]): Promise<any> {
    return this._isDbReady.pipe(
      switchMap(async (isDbReady) => {
        if (!this.isDbReady) {
          return of({values: []});
        } else {
          const dbConn = await this.sqlitePlugin.createConnection(
            DB_NAME,
            DB_ENCRYPTED,
            DB_MODE,
            DB_VERSION
          );
          if (!!dbConn) {
            await dbConn.open();
            let result = null;
            try {
              let set: capSQLiteSet[] = statementsData.map(st => { return { statement: st.statement, values: st.args };});
              result = await dbConn.executeSet(set, true);
            } finally {
              await dbConn.close();
            }
            return result;
          }
        }
      })
    ).toPromise();
  }

  private async setupDatabase(): Promise<void> {
    const isDbExists = await this.sqlitePlugin.isDatabase(DB_NAME);
    if (!isDbExists.result) {
      //if db not exist, then create db and tables
      const db: SQLiteDBConnection = await this.sqlitePlugin.createConnection(
        DB_NAME,
        DB_ENCRYPTED,
        DB_MODE,
        DB_VERSION
      );
      console.log('db', db);
      if (!!db) {
        const schemeText = await this.http
          .get('assets/scheme.sql', { responseType: 'text' })
          .pipe(take(1))
          .toPromise();

        return this.executeSql({ statement: schemeText })
          .then(() => {
            console.log('DB Initialized');
            this._isDbReady.next(true);
            return Promise.resolve();
          })
          .catch((e) => {
            console.log(e);
            return Promise.resolve();
          });
      } else {
        return Promise.reject(new Error(`no db returned is null`));
      }
    } else {
      this._isDbReady.next(true);
    }
  }
}
