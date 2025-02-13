import { IError } from "ngx-sp-infra";

export class RetInfraUsuarioEmail implements IError{
  Error: boolean = false;
  ErrorMessage: string = "";
  Email: string = "";
}