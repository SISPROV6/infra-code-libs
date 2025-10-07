import { IError } from "ngx-sp-infra";
import { InfraQueueRecord } from "./InfraQueueRecord";

export class RetInfraQueueRecord implements IError{
    Error: boolean=false;
    ErrorMessage: string = "";
    Data: InfraQueueRecord = new InfraQueueRecord();
}
