import { IError } from "../../../../models/utils/ierror";
import { IntegracoesParameterRecord } from "../7Db/InfraIntegrationParameterRecord";

export class RetIntegracaoParameter implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    IntegrationParameter: IntegracoesParameterRecord = new IntegracoesParameterRecord();
}