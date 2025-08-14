import { IError } from "ngx-sp-infra";
import { InfraUsuarioImg } from './infrausuarioimg';

export class RetInfraUsuarioEmail implements IError{
  Error: boolean = false;
  ErrorMessage: string = "";
  Email: string = "";
}