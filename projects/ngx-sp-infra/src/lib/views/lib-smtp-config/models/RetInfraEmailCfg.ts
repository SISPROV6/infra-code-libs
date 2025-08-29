import { IError } from "ngx-sp-infra";
import { InfraEmailCfgRecord } from "./InfraEmailCfgRecord";

export class RetInfraEmailCfg implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    InfraEmailCfg: InfraEmailCfgRecord = new InfraEmailCfgRecord();
}