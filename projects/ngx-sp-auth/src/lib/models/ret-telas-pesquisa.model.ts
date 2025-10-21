import { IError, ITelaRota } from 'ngx-sp-infra';

export class RetTelasPesquisa implements IError {
  Error: boolean = false;
  ErrorMessage: string = "";
  Telas: ITelaRota[] = [];
}