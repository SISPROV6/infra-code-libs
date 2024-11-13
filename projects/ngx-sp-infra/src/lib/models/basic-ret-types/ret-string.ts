import { IError } from '../ierror';

export class RetString implements IError {
  Error: boolean = false;
  ErrorMessage: string = "";
  String: string = "";
}