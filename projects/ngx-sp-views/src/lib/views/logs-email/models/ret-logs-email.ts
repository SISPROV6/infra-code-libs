import { IError } from "ngx-sp-infra";
import { Logs } from "./logs-email";

export class RetLogsEmail implements IError {
    Error: boolean =false;
    ErrorMessage: string = "";
    LogsEmail: Logs[] = [];
    Count: number = 0;
}
