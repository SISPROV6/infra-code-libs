import { IError } from '../utils/ierror';

export class RetStringList implements IError {
  Error: boolean = false;
  ErrorMessage: string = "";
  StringList: string[] = [];
}