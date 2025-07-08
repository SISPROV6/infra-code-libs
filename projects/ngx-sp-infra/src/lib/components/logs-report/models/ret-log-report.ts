import { IError } from "../../../../public-api";
import { Logs } from "./logs-report";

export class RetLogReport implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogReport: Logs = new Logs();
}
