import { IError } from "../../../../public-api";

export class RetTipoPessoa implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    TipoPessoa: number = 0;
}