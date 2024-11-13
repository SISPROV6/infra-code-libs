import { IError } from '../ierror';

export class RetBoolean implements IError {
  Error: boolean = false;
  ErrorMessage: string = "";
  Boolean: boolean = false;
}