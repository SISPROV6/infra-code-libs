import { IError } from "ngx-sp-infra";
import { UsuarioLDAP } from "./UsuarioLDAP.record";

export class RetUsuariosLDAP implements IError {
    Error: boolean = false;
    ErrorMessage: string = '';
    InfraConfigLDAP: number = 0;
    Usuarios: UsuarioLDAP[] = [];
}