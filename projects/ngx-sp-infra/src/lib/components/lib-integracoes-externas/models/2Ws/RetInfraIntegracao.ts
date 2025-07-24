import { IError } from "../../../../models/utils/ierror";
import { IntegracoesRecord } from "../7Db/IntegracoesRecord";

export class RetInfraIntegracao implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    Integration: IntegracoesRecord = new IntegracoesRecord();
}