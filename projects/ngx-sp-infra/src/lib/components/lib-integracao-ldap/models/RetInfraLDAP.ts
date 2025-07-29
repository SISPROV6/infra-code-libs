import { IError } from "../../../models/utils/ierror";
import { InfraLDAP } from "./InfraLDAP";

export class RetInfraLDAP implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    InfraLDAP: InfraLDAP = new InfraLDAP();
}