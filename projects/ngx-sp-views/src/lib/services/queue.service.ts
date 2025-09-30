import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { MessageService, RetError } from 'ngx-sp-infra';

import { Observable, take, tap } from 'rxjs';
import { JobRequest } from '../models/queue-service/JobRequest';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
    private readonly _BASE_URL: string = window.location.hostname.includes('localhost') ? `https://SiscanDesV6.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2QueueWS/api/Queue` : `https://${ window.location.hostname }/SisproErpCloud/Service_Private/Infra/SpInfra2QueueWS/api/Queue`; // SpInfra2ConfigErpWS


  constructor(private httpClient: HttpClient, private _messageService: MessageService) {
  }

  private montarUrl(routePrefix: string, params: HttpParams): string {
    const queryString = params.toString();
    return queryString ? `${routePrefix}?${queryString}` : routePrefix;
  }

  private Enqueue(jobRequest: JobRequest): Observable<RetError> {
    const url = `${this._BASE_URL}/Enqueue`;

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.httpClient.post<RetError>(url, jobRequest, { headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public CreateJobRequest(routePrefix: string, FinalHttpMethod: "POST" | "GET" | "DELETE", headerParameter: HttpParams | null, tenantId:number, scheduleDate: string = "", customMessage = "", isParallel:boolean = false, bodyParameter?: string | object) {
    const jobRequest = new JobRequest();
    jobRequest.Tenant_Id = tenantId;
    jobRequest.BodyParameter = typeof bodyParameter == 'string' ? bodyParameter : JSON.stringify(bodyParameter);
    jobRequest.FinalHttpMethod = FinalHttpMethod;
    jobRequest.FinalMethodEnpoint = headerParameter != null ? this.montarUrl(routePrefix, headerParameter) : routePrefix;
    jobRequest.ScheduleDate = scheduleDate == "" ? "1900-01-01" : scheduleDate;
    jobRequest.RoutePrefix = routePrefix;
    jobRequest.IsParallel = isParallel;
    this.Enqueue(jobRequest).subscribe({
      next: () => {
        if (customMessage != "") {
          this._messageService.showAlertSuccess(customMessage);
        }
      },
      error: (err) => {
        throw Error(err);
      }
    });
  }



}
