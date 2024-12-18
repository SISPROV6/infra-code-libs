import { IError } from '../utils/ierror';

export class RetBoolean implements IError {
  Error: boolean = false;
  ErrorMessage: string = "";
  Boolean: boolean = false;
}