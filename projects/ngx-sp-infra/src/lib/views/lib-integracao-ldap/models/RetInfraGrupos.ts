import { IError } from "../../../models/utils/ierror";
import { InfraGrupos } from "./InfraGrupos";

export class RetInfraGrupos implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    InfraGrupos: InfraGrupos[] = [];
}