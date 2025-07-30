import { IError } from "../../../../models/utils/ierror";
import { IntegracaoAzureSSORecord } from "../3Rn/IntegracaoAzureSSORecord";

export class RetIntegracaoAzureSSO implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    IntegrationAzureSSO: IntegracaoAzureSSORecord = new IntegracaoAzureSSORecord();
}