import { IError } from "ngx-sp-infra";

export class RetToken implements IError {
  Error: boolean = false;
  ErrorMessage: string = '';
  Token: string = '';
}
