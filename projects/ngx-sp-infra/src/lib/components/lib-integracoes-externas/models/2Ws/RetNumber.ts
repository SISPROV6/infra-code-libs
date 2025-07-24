import { IError } from "../../../../models/utils/ierror";

export class RetNumber implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    Integration: number = 0;
}