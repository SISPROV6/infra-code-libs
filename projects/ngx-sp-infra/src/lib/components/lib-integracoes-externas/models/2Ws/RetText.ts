import { IError } from "../../../../models/utils/ierror";

export class RetText implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    Integration: string = "";
}