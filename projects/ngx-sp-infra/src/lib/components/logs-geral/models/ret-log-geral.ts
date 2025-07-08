import { IError } from "../../../../public-api";
import { Logs } from "./logs-geral";

export class RetLogGeral implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogGeral: Logs = new Logs();
}
