import { IError } from "ngx-sp-infra";
import { InfraAuthentication } from "./InfraAuthentication";

export class RetInfraAuthentication implements IError
{
    Error: boolean = false;
    ErrorMessage: string  = "";
    InfraAuthentication: InfraAuthentication = new InfraAuthentication();
}