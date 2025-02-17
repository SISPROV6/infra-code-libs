import { IError } from "ngx-sp-infra";

export class RetLogin implements IError {
  Error: boolean = false;
  ErrorMessage: string = '';
  TenantId: number = 0;
  EstabelecimentoId: string = '';
  NomeEstabelecimento: string = '';
  EmpresaId: string = '';
  NomeEmpresa: string = '';
  InfraUsuarioId: string = '';
  UserName: string = '';
  Token: string = '';
  Dominio: string = '';
  InitializePassword: boolean = false;
  InfraInAuthTypeId: number = 0;
  InfraIn2FaTypeId?: number | null;
  Is2FaEnabled: boolean = false; 
  FeedbackMessage: string = ''; 
}
