import { Injectable } from "@angular/core";
import { migrations } from "../migrations/migrations";
import { Migration } from "../models/migration.model";
import { DataBaseService, StatementData } from "../modules/data-base-service/data-base.service";


@Injectable({providedIn: 'root'})
export class MigrationService {
    constructor(private dbService: DataBaseService) {}

    public async migrateToVersion(appVersion: string): Promise<void> {
        let dbAppVersion = await this.dbService.executeSql({statement: "SELECT * FROM [Migrations] ORDER BY Date desc LIMIT 1"}).then(sqlRes => {
            let result = null;
            if (!!sqlRes && sqlRes.rows.length > 0 ) {
              let lastMigration = sqlRes.rows.item(0);
              result = lastMigration.appVersion;
            }
            return result;
          }).catch(err => {
            return null;
          });

          if(!dbAppVersion || this.isANewerThanB(appVersion, dbAppVersion)) {

            let migrationStatements: StatementData[] = this.getMigrationStatementsForVersion(dbAppVersion, migrations);

            //Зафиксировать версию миграции в БД
            migrationStatements.push({
                statement: 'INSERT INTO [Migrations] (appVersion, date) VALUES (?, ?)',
                args: [
                  appVersion,
                  new Date(),
                ]
            } as StatementData);

            await this.dbService.executeBatch(migrationStatements);
          }
          
          return null;
    }

    private isANewerThanB(a: string, b: string): boolean {
        if (typeof a !== 'string') return false;
        if (typeof b !== 'string') return false;

        a = a.replace(/(?<num>(\d*\.?)*).*?/g, "$1");
        b = b.replace(/(?<num>(\d*\.?)*).*?/g, "$1");

        let aDestructed = a.split('.');
        let bDestructed = b.split('.');
        const k = Math.min(aDestructed.length, bDestructed.length);
        for (let i = 0; i < k; ++ i) {
            let aCasted = [];
            let bCasted = [];
            aCasted[i] = parseInt(aDestructed[i], 10);
            bCasted[i] = parseInt(bDestructed[i], 10);
            if (aCasted[i] > bCasted[i]) return true;
            if (aCasted[i] < bCasted[i]) return false;        
        }
        return aDestructed.length == bDestructed.length 
            ? false
            : (aDestructed.length < bDestructed.length ? false : true);
    }

    public getMigrationStatementsForVersion(appVersion: string, migrations: Migration[]): StatementData[] {
        //TODO
        //1.Найти все миграции старше заданной версии
        //2.Отсортировать найденное по возрастанию
        //3.Перебрать полученный список и получить StatementsData из каждого элемента
        let targetMigrations = migrations.filter(m => !appVersion || this.isANewerThanB(m.appVersion, appVersion))
          .sort((a, b) => this.isANewerThanB(a.appVersion, b.appVersion) ? 1 : -1);
        return targetMigrations.map(tm => tm.Up());
    }
}