import { IError } from "../utils/ierror";
import { InfraEstabelecimentoFavoritoDefault } from "./infra-estabelecimento";

export class RetEstabelecimentosModal implements IError {
   Error: boolean = false;
   ErrorMessage: string = "";
   InfraEstabelecimentos: InfraEstabelecimentoFavoritoDefault[] = [];
}