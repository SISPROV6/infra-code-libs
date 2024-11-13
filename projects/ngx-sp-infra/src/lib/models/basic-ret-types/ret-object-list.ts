import { IError } from '../ierror';

export class RetObjectList implements IError {
  Error: boolean = false;
  ErrorMessage: string = "";
  ObjectList: string[] | number[] = [];
}