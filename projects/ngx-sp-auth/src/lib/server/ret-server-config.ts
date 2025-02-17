import { IError } from "ngx-sp-infra";

export class RetServerConfig implements IError {
  Error: boolean = false;
  ErrorMessage: string = '';
  User: string = '';
  Password: string = '';
}
