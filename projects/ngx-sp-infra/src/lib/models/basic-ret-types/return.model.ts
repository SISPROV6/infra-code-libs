import { IError } from "../utils/ierror";

export class ReturnModel<T> implements IError {
  Error: boolean = false;
  ErrorMessage: string = '';
  Data: T | null = null;
}