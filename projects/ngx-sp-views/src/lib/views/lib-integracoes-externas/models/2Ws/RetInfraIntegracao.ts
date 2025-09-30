import { IError } from "ngx-sp-infra";
import { IntegracaoAzureSSORecord } from "../3Rn/IntegracaoAzureSSORecord";

export class RetInfraIntegracao implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    Integration: IntegracaoAzureSSORecord = new IntegracaoAzureSSORecord();
}