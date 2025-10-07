import { IError } from "ngx-sp-infra";

export class CriacaoPorData{
    Data: Date|string = "";
    TotalCriadas:number = 0;
}

export class RetCriacaoPorData implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    Data: CriacaoPorData = new CriacaoPorData();
}
