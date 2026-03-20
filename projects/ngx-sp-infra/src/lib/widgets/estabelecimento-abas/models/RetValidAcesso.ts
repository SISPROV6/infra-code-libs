import { IError } from "../../../../public-api";

export class RetValidAcesso implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    ValidAcesso: boolean = false;
}