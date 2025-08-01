import { IError } from "../../../../public-api";
import { Logs } from "./logs-ws";

export class RetLogsWS implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogsWS: Logs[] = [];
    Count: number = 0;
}
