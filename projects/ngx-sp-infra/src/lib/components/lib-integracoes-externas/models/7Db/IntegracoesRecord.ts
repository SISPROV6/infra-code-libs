export class IntegracoesRecord {
    Id: number = 0;
    Name: string = "";
    Tenant_Id: number = 0;
    InfraIntegrationDesc: string = "";
    Is_Active: boolean = true;
    ActiveSince: Date = new Date();
    InfraIntegrationUpdated: Date = new Date();
    InfraIntegrationUpdatedBy: string = "";
}