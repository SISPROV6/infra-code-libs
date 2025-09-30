import { IError } from "ngx-sp-infra";
import { IntegracoesRecord } from "../3Rn/IntegracaoAzureSSORecord";

export class RetInfraIntegracao implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    Integration: IntegracoesRecord = new IntegracoesRecord();
}