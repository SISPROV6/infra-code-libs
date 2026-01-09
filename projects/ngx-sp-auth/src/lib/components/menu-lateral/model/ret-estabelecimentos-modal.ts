import { IError } from "ngx-sp-infra";
import { InfraEstabelecimentoFavoritoDefault } from "./InfraEstabelecimentoFavoritoDefault";

export class RetEstabelecimentosModal implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    InfraEstabelecimentos: InfraEstabelecimentoFavoritoDefault [] = [];
}