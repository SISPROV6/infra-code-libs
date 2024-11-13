import { IError } from '../ierror';

export class RetNumber implements IError {
  public Error: boolean = false;
  public ErrorMessage: string = "";
  public Number: number = 0;
}
