import { IError } from "ngx-sp-infra";
import { InfraQueueTableRows } from "./InfraQueueTableRows";

export class RetInfraQueueTableRows implements IError{
    Error: boolean=false;
    ErrorMessage: string="";
    Data: InfraQueueTableRows[]=[]
}
