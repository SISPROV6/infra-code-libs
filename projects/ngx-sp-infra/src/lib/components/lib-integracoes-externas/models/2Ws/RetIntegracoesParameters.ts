import { IError } from "../../../../models/utils/ierror";
import { IntegracoesParameterRecord } from "../7Db/InfraIntegrationParameterRecord";

export class RetIntegracoesParameters implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    IntegrationParameter: IntegracoesParameterRecord[] = [];
}