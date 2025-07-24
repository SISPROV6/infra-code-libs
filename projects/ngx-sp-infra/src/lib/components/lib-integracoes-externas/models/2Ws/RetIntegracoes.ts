import { IError } from "../../../../models/utils/ierror";
import { IntegracoesRecord } from "../7Db/IntegracoesRecord";

export class RetIntegracoes implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    Integration: IntegracoesRecord[] = [];
}