import { IError } from "ngx-sp-infra";

export class ErrosDiarios{
    Hora:number = 0;
    TotalFalhas:number = 0;
}

export class RetErrosDiarios implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    Data: ErrosDiarios[] = [];
}
