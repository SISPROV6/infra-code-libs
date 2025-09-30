import { IError } from "ngx-sp-infra";
import { Logs } from "./logs-geral";

export class RetLogGeral implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogGeral: Logs = new Logs();
}
