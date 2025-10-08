import { IError } from "ngx-sp-infra";
import { Count } from "./Count";

export class RetCount implements IError{
    Error: boolean=false;
    ErrorMessage: string = "";
    Data:Count = new Count();
}
