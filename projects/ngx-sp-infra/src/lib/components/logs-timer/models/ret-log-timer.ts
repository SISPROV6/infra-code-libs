import { IError } from "../../../../public-api";
import { Logs } from "./logs-timer";

export class RetLogTimer implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogTimer: Logs = new Logs();
}
