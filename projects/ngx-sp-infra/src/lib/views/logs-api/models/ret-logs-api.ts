import { IError } from "../../../../public-api";
import { Logs } from "./logs-api";

export class RetLogsApi implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    LogsApi: Logs[] =[];
    Count: number = 0;
}
