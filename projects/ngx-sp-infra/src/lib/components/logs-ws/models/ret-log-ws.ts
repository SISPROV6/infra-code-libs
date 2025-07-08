import { IError } from "../../../../public-api";
import { Logs } from "./logs-ws";

export class RetLogWS implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogWS: Logs = new Logs();
}
