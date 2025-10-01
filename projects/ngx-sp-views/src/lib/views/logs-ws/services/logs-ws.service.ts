import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take, tap } from 'rxjs';

import { LibCustomConfigERPEnvironmentService } from '../../../custom/lib-custom-configerp-environment.service';
import { RetLogWS } from '../models/ret-log-ws';
import { RetLogsWS } from '../models/ret-logs-ws';
import { SearchLogWS } from '../models/search-log-ws';

@Injectable({
  providedIn: 'root'
})
export class LogsWSService {

  private readonly _BASE_URL: string = ''; // SpInfra2ConfigErpWS

  private readonly _HTTP_HEADERS: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private _httpClient: HttpClient,
    private _customEnvironmentService: LibCustomConfigERPEnvironmentService
  ) {
    this._BASE_URL = `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraLogWS`; // SpInfra2ConfigErpWS
    this._BASE_URL = !this._customEnvironmentService.production ? this._BASE_URL : `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraLogWS`;
  }

  // #region ==========> SERVICE METHODS <==========

  // #region Get
  getLog(id: number): Observable<RetLogWS> {

    const params = new HttpParams()
      .set('id', id);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const url = `${this._BASE_URL}/Get`;

    return this._httpClient
      .get<RetLogWS>(url, { 'params': params, 'headers': headers })
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
  getLogsList(search: SearchLogWS): Observable<RetLogsWS> {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const url = `${ this._BASE_URL }/GetLogsList`;

    return this._httpClient
      .post<RetLogsWS>(url, JSON.stringify(search),{ 'headers': headers })
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

