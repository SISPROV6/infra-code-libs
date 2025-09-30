import { IError } from "ngx-sp-infra";
import { Logs } from "./logs-data-access";

export class RetLogsDataAccess implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogsDataAccess: Logs[] = [];
    Count: number = 0;
}
