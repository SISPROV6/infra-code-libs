import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take, tap } from 'rxjs';


import { RetLogReport } from '../models/ret-log-report';
import { RetLogsReport } from '../models/ret-logs-report';
import { SearchLogReport } from '../models/search-log-report';

@Injectable({
  providedIn: 'root'
})
export class LogsReportService {
      private readonly _BASE_URL: string = window.location.hostname.includes('localhost') ? `https://SiscanDesV6.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraLogReport` : `https://${ window.location.hostname }/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraLogReport`; // SpInfra2ConfigErpWS

private readonly _HTTP_HEADERS: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

constructor(private _httpClient: HttpClient) {
}

// #region ==========> SERVICE METHODS <==========

// #region Get
getLog(id: number): Observable<RetLogReport> {

  const params = new HttpParams()
    .set('id', id);

  const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

  const url = `${this._BASE_URL}/Get`;

  return this._httpClient
    .get<RetLogReport>(url, { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap(response => {

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

        })
      );
}
// #endregion Get

// #region GetList
getLogsList(search: SearchLogReport): Observable<RetLogsReport> {

  const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

  const url = `${ this._BASE_URL }/GetLogsList`;

  return this._httpClient
    .post<RetLogsReport>(url, JSON.stringify(search),{ 'headers': headers })
      .pipe(
        take(1),
        tap(response => {

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

        })
      );
}
// #endregion GetList

// #endregion ==========> SERVICE METHODS <==========
}
