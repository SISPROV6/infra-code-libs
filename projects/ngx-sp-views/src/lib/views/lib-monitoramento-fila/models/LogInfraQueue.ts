import { IError } from "ngx-sp-infra";

export class LogInfraQueueRecord {
  Id: number;
  Tenant_Id: number;
  DominioOrigem: string;
  DtHora: Date;
  MetodoOrigem: string;
  Msg: string;
  Nivel: string;
  StackTrace: string;
  TaskId: number;

  constructor() {
    this.Id = 0;
    this.Tenant_Id = 0;
    this.DominioOrigem = '';
    this.DtHora = new Date();
    this.MetodoOrigem = '';
    this.Msg = '';
    this.Nivel = '';
    this.StackTrace = '';
    this.TaskId = 0;
  }
}

export class RetLogInfraQueue implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    Data:LogInfraQueueRecord[]=[];
}
