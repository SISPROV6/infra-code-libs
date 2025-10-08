export class InfraQueueRecord{
    Id:number = 0;
    Tenant_Id:number = 0;
    BodyParameter:string = "";
    RoutePrefix:string = "";
    Token:string = "";
    Domain:string = "";
    HttpMethod:string = "";
    Status:string = "";
    CreateDate:Date = new Date(1900,1,1);
    ScheduleDate:Date=new Date(1900,1,1);
    Endpoint:string = "";
    Attempts:number = 0;
    IsParallel = false;
    UserId:string = "";
    UserName:string = "";
    LastUpdate: Date=new Date(1900,1,1);
}
