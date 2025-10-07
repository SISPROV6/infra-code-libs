import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { RetInfraQueueTableRows } from '../models/RetInfraQueueTableRows';
import { RetCount } from '../models/RetCount';
import { RetCriacaoPorData } from '../models/CriacaoPorData';
import { RetMetricasEndpoint } from '../models/MetricasEndpoint';
import { RetErrosDiarios } from '../models/ErrosDiarios';
import { RetErrosSemanais } from '../models/ErrosSemanais';
import { RetLogInfraQueue } from '../models/LogInfraQueue';
import { RetInfraQueueRecord } from '../models/RetInfraQueueRecord';
import { RetLogInfraQueueRecord } from '../models/RetLogInfraQueueRecord';
import { LibCustomConfigERPEnvironmentService } from '../../../custom/lib-custom-configerp-environment.service';
import { RetError, RetNumber } from 'ngx-sp-infra';

@Injectable({
  providedIn: 'root'
})
export class LibMonitoramentoFilaService {
  private readonly _BASE_URL: string = "";

  // constructor(private _httpClient: _httpClient) {
  //   this._BASE_URL = !environment.production
  //     ? this._BASE_URL
  //     : `${environment.Sp2LocalhostWS}/Queue`;
  // }

  constructor(
      private _httpClient: HttpClient,
      private _customEnvironmentService: LibCustomConfigERPEnvironmentService
    ) {
      this._BASE_URL = `${ this._customEnvironmentService.SpInfra2QueueWS }/Queue`; // SpInfra2QueueWS
      this._BASE_URL = !this._customEnvironmentService.production ? this._BASE_URL : `${ this._customEnvironmentService.SpInfra2QueueWS }/Queue`;
    }

  private _isGlobalQueue: boolean = false;
  setIsGlobalQueue(value: boolean) {
    this._isGlobalQueue = value;
  }

  getIsGlobalQueue(): boolean {
    return this._isGlobalQueue;
  }

  GetList(httpMethod: string = "", status: string = "", createddateini: Date | string, createddatefinal: Date | string = "", endpoint: string = ""): Observable<RetInfraQueueTableRows> {
    const url = `${this._BASE_URL}/GetList`;

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    let params: HttpParams = new HttpParams()
      .set('createddateini', createddateini.toString())
      .set('createddatefinal', createddatefinal.toString())
      .set('isGlobalQueue', this._isGlobalQueue)

    if (httpMethod != "") {
      params = params.append('httpmethod', httpMethod)
    }

    if (status != "") {
      params = params.append('status', status)
    }
    if (endpoint != "") {
      params = params.append('endpoint', endpoint)
    }

    return this._httpClient.get<RetInfraQueueTableRows>(url, { params: params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }


  public GetCount() {
    const url = `${this._BASE_URL}/GetCount`;

    const httpParams:HttpParams = new HttpParams()
    .set('isGlobalQueue', this._isGlobalQueue)

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetCount>(url, {params:httpParams, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetProximosAgendados() {
    const url = `${this._BASE_URL}/GetProximosAgendados`;

    const params:HttpParams = new HttpParams()
    .set('isGlobalQueue', this._isGlobalQueue)
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetInfraQueueTableRows>(url, {params:params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public Dequeue(id: number) {
    const url = `${this._BASE_URL}/Dequeue`;

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const params: HttpParams = new HttpParams()
      .set('id', id)
      .set('isGlobalQueue', this._isGlobalQueue);

    return this._httpClient.post<RetError>(url, null, { params: params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetNumeroAgendadosParaHoje() {
    const url = `${this._BASE_URL}/GetNumeroAgendadosParaHoje`;

    const params:HttpParams = new HttpParams()
    .set('isGlobalQueue', this._isGlobalQueue);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetNumber>(url, {params:params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetAgendadosParaHoje() {
    const url = `${this._BASE_URL}/GetAgendadosParaHoje`;

    const params:HttpParams = new HttpParams()
    .set('isGlobalQueue', this._isGlobalQueue)

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetInfraQueueTableRows>(url, {params:params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetNumeroFalhasHoje() {
    const url = `${this._BASE_URL}/GetNumeroFalhasHoje`;

const params:HttpParams = new HttpParams()
    .set('isGlobalQueue', this._isGlobalQueue)

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetNumber>(url, {params:params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetFalhasHoje() {
    const url = `${this._BASE_URL}/GetFalhasHoje`;

    const params:HttpParams = new HttpParams()
    .set('isGlobalQueue', this._isGlobalQueue)

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetInfraQueueTableRows>(url, {params:params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetHistoricoCriacaoPorData() {
    const url = `${this._BASE_URL}/GetHistoricoCriacaoPorData`;

    const params:HttpParams = new HttpParams()
    .set('isGlobalQueue', this._isGlobalQueue)

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetCriacaoPorData>(url, {params:params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }


  public GetChamadasPorEndpoint() {
    const url = `${this._BASE_URL}/GetChamadasPorEndpoint`;

    const params:HttpParams = new HttpParams()
    .set('isGlobalQueue', this._isGlobalQueue)

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetMetricasEndpoint>(url, {params:params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetFalhasPorEndpoint() {
    const url = `${this._BASE_URL}/GetFalhasPorEndpoint`;

    const params:HttpParams = new HttpParams()
    .set('isGlobalQueue', this._isGlobalQueue)

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetMetricasEndpoint>(url, {params:params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetEstatisticasErrosDiarios() {
    const url = `${this._BASE_URL}/GetEstatisticasErrosDiarios`;

    const params:HttpParams = new HttpParams()
    .set('isGlobalQueue', this._isGlobalQueue)

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetErrosDiarios>(url, {params:params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetEstatisticasErrosSemanais() {
    const url = `${this._BASE_URL}/GetEstatisticasErrosSemanais`;

    const params:HttpParams = new HttpParams()
    .set('isGlobalQueue', this._isGlobalQueue)

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetErrosSemanais>(url, {params:params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetLogsList(search: string) {
    const url = `${this._BASE_URL}/GetLogsList`;

    const params: HttpParams = new HttpParams()
      .set('search', search)
      .set('isGlobalQueue', this._isGlobalQueue);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetLogInfraQueue>(url, { params: params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetQueueTaskById(id:number){
    const url = `${this._BASE_URL}/GetQueueTaskById`;

    const params: HttpParams = new HttpParams()
      .set('id', id)
      .set('isGlobalQueue', this._isGlobalQueue);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetInfraQueueRecord>(url, { params: params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }

  public GetLogByTaskId(id:number){
    const url = `${this._BASE_URL}/GetLogByTaskId`;

    const params: HttpParams = new HttpParams()
      .set('id', id)
      .set('isGlobalQueue', this._isGlobalQueue);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this._httpClient.get<RetLogInfraQueueRecord>(url, { params: params, headers: headers })
      .pipe(take(1), tap(response => {
        if (response.Error) {
          throw Error(response.ErrorMessage);
        }
      }));
  }
}
