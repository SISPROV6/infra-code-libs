import { IError } from "ngx-sp-infra";
import { RadioOption } from "./RadioOption";

export class RetRadioOptions implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    RadioOptions: RadioOption[] = [];
}