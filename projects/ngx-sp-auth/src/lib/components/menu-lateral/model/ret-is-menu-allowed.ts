import { IError } from "ngx-sp-infra";

export class RetIsMenuAllowed implements IError{
  Error: boolean = false;
  ErrorMessage: string = "";
  IsMenuAllowed: boolean = false;
}