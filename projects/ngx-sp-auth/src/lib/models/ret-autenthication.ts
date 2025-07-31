import { IError } from "ngx-sp-infra";

export class RetAutenthication implements IError {
  Error: boolean = false;
  ErrorMessage: string = '';
  User: string = '';
  Password: string = '';
  TenantId: number = 0;
  Domain: string = '';
  InfraInAuthTypeId: number = 0;
  InfraIn2FaTypeId?: number | null | undefined;
  Is2FaEnabled: boolean = false; 
  AzureTenantId: string = '';
  AzureClientId: string = '';
}
