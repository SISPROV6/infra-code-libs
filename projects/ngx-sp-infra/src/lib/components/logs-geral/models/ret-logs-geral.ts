import { IError } from "../../../../public-api";
import { Logs } from "./logs-geral";

export class RetLogsGeral implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogsGeral: Logs[] = [];
    Count: number = 0;
}
