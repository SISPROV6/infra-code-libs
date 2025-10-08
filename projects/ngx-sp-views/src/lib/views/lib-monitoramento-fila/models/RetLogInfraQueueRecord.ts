import { IError } from "ngx-sp-infra";
import { LogInfraQueueRecord } from "./LogInfraQueue";

export class RetLogInfraQueueRecord implements IError{
    Error: boolean=false;
    ErrorMessage: string="";
    Data: LogInfraQueueRecord= new LogInfraQueueRecord();
}
