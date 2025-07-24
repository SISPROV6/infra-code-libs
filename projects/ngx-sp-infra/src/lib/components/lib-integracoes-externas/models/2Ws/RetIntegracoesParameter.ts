import { IError } from "../../../../models/utils/ierror";
import { IntegracoesParameterRecord } from "../7Db/InfraIntegrationParameterRecord";

export class RetIntegracoesParameter implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    IntegrationParameter: IntegracoesParameterRecord[] = [];
}