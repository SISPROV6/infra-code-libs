import { IntegracoesParameterRecord } from "./IntegrationParameterRecord";

export class IntegracaoAzureSSORecord {
    Tenant_Id: number = 0;
    Id: number = 0;
    Name: string = "";
    InfraIntegrationDesc: string = "";
    Is_Active: boolean = true;
    ActiveSince: Date = new Date();
    Updated: Date = new Date();
    UpdatedBy: string = "";
    Parameters: IntegracoesParameterRecord[] = [];
}