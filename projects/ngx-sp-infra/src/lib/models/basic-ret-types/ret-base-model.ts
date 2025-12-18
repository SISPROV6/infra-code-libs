import { IError } from "../utils/ierror";

export class RetBaseModel implements IError {
  Error: boolean = false;
  ErrorMessage: string = '';
  Data: any = null;
}