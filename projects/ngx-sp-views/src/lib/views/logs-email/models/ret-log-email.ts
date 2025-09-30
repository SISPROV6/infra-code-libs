import { IError } from "ngx-sp-infra";
import { Logs } from "./logs-email";

export class RetLogEmail implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogEmail: Logs = new Logs();
}
