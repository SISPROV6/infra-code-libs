import { IError } from "ngx-sp-infra";
import { IntegracoesRecord } from "../3Rn/IntegracaoAzureSSORecord";

export class RetIntegracoes implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    Integration: IntegracoesRecord[] = [];
}