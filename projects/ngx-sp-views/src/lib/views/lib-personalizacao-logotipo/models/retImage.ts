
import { IError } from "ngx-sp-infra";
import { InfraLicBinariesRecord } from "./infra-licbinaries.record";

export class RetImage implements IError {
    Error: boolean = false;
    ErrorMessage: string  = "";
    Image: InfraLicBinariesRecord = new InfraLicBinariesRecord();
}