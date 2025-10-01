import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take, tap } from 'rxjs';

import { LibCustomConfigERPEnvironmentService } from '../../../custom/lib-custom-configerp-environment.service';
import { RetLogApi } from '../models/ret-log-api';
import { RetLogsApi } from '../models/ret-logs-api';
import { SearchLogApi } from '../models/search-log-api';

@Injectable({
  providedIn: 'root'
})
export class LogsApiService {
  private readonly _BASE_URL: string = ''; // SpInfra2ConfigErpWS

  private readonly _HTTP_HEADERS: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private _httpClient: HttpClient,
    private _customEnvironmentService: LibCustomConfigERPEnvironmentService
  ) {
    this._BASE_URL = `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraLogApi`; // SpInfra2ConfigErpWS
    this._BASE_URL = !this._customEnvironmentService.production ? this._BASE_URL : `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraLogApi`;
  }

  // #region ==========> SERVICE METHODS <==========

  // #region Get
  getLog(id: number): Observable<RetLogApi> {

    const params = new HttpParams()
      .set('id', id);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const url = `${this._BASE_URL}/Get`;

    return this._httpClient
      .get<RetLogApi>(url, { 'params': params, 'headers': headers })
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
  getLogsList(search: SearchLogApi): Observable<RetLogsApi> {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const url = `${ this._BASE_URL }/GetLogsList`;

    return this._httpClient
      .post<RetLogsApi>(url, JSON.stringify(search),{ 'headers': headers })
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

