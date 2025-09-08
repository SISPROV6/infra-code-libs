import { IError } from "../../../../public-api";
import { Logs } from "./logs-report";

export class RetLogsReport implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogsReport: Logs[] = [];
    Count: number = 0;
}
