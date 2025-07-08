import { IError } from "../../../../public-api";
import { Logs } from "./logs-timer";

export class RetLogsTimer implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogsTimer: Logs[] = [];
    Count: number = 0;
}
