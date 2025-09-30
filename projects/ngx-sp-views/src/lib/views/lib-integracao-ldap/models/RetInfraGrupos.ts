import { IError } from "ngx-sp-infra";
import { InfraGrupos } from "./InfraGrupos";

export class RetInfraGrupos implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    InfraGrupos: InfraGrupos[] = [];
}