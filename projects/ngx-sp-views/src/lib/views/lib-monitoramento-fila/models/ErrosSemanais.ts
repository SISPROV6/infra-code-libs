import { IError } from "ngx-sp-infra";

export class ErrosSemanais{
    Data:Date | string = "";
	TotalRequests: number=0;
    TotalFalhas: number =0;
    TaxaFalhaPercentual: number =0;
}

export class RetErrosSemanais implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    Data:ErrosSemanais[] = [];
}
