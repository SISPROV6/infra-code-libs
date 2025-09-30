import { IError } from "ngx-sp-infra";
import { Logs } from "./logs-api";

export class RetLogApi implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogApi: Logs = new Logs();
}
