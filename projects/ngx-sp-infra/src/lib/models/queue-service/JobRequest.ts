export class JobRequest {
  Tenant_Id: number = 0;
  BodyParameter: string = "";
  RoutePrefix:string = "";
  FinalHttpMethod: string = "";
  FinalMethodEnpoint: string = "";
  ScheduleDate: string | Date = "";
  IsParallel:boolean = false;
}
