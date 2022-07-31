import { StatementData } from "../modules/data-base-service/data-base.service";

export interface Migration {
    get appVersion(): string;
    Up: () => StatementData;
    Down: () => StatementData;
}