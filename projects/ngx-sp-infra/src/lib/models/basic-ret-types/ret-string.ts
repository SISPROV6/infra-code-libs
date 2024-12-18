import { IError } from '../utils/ierror';

export class RetString implements IError {
  Error: boolean = false;
  ErrorMessage: string = "";
  String: string = "";
}