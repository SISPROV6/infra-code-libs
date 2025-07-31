import { IError } from "../../../../models/utils/ierror";
import { IntegracoesRecord } from "../3Rn/IntegracaoAzureSSORecord";

export class RetIntegracoes implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    Integration: IntegracoesRecord[] = [];
}