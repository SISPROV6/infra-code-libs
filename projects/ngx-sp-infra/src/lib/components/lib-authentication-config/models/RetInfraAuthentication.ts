import { IError } from "../../../models/utils/ierror";
import { InfraAuthentication } from "./InfraAuthentication";

export class RetInfraAuthentication implements IError
{
    Error: boolean = false;
    ErrorMessage: string  = "";
    InfraAuthentication: InfraAuthentication = new InfraAuthentication();
}