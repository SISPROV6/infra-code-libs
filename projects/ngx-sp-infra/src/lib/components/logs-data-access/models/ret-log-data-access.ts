import { IError } from "../../../../public-api";
import { Logs } from "./logs-data-access";

export class RetLogDataAccess implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogDataAccess: Logs = new Logs();
}
