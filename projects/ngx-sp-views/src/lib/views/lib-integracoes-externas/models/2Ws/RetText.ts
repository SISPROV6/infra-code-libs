import { IError } from "ngx-sp-infra";

export class RetText implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    Integration: string = "";
}