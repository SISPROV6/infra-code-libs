import { IError } from "ngx-sp-infra";
import { Logs } from "./logs-geral";

export class RetLogsGeral implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogsGeral: Logs[] = [];
    Count: number = 0;
}
