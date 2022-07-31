import { Migration } from "../models/migration.model";
import { StatementData } from "../modules/data-base-service/data-base.service";

export const migrations: Migration[] = [
    {
        get appVersion(): string {
            return "0.0.20";
        },
        Up(): StatementData {
            return {
                statement: `
                CREATE TABLE IF NOT EXISTS [Migrations] (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    appVersion VARCHAR,
                    date DATETIME
                );
                `
            } as StatementData;
        },
        Down(): StatementData {
            return null;
        }
    } as Migration
];