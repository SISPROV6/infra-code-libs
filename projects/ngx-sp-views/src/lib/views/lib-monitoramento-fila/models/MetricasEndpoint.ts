import { IError } from "ngx-sp-infra";

export class MetricasEndpoint{
    Endpoint: string = "";
    TotalMetrica = 0;
}

export class RetMetricasEndpoint implements IError{
    Error: boolean= false;

    ErrorMessage: string="";
    Data:MetricasEndpoint= new MetricasEndpoint();
}

export class RetNumber implements IError{
    Error: boolean=false;
    ErrorMessage: string="";
    Data:number =0;
}
