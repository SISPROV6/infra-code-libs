import { IError } from "../../../models/utils/ierror";
import { RadioOption } from "./RadioOption";

export class RetRadioOptions implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    RadioOptions: RadioOption[] = [];
}