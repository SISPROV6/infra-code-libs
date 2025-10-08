export class InfraQueueTableRows {
  Id: number;
  HttpMethod: string;
  Status: string;
  CreateDate: Date | string;
  ScheduleDate: Date | string;
  Endpoint: string;
  Attempts: number;
  IsParallel:boolean;
  Domain: string;
  Tenant_Id: number;

  constructor() {
    this.Id = 0;
    this.HttpMethod = "";
    this.Status = "";
    this.CreateDate = ""
    this.ScheduleDate = ""
    this.Endpoint= "";
    this.Attempts = 0;
    this.IsParallel = false;
    this.Domain = "";
    this.Tenant_Id =0;
  }
}