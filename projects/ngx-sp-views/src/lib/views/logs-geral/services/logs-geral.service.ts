import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take, tap } from 'rxjs';

import { LibCustomConfigERPEnvironmentService } from '../../../custom/lib-custom-configerp-environment.service';
import { RetLogGeral } from '../models/ret-log-geral';
import { RetLogsGeral } from '../models/ret-logs-geral';
import { SearchLogGeral } from '../models/search-log-geral';

@Injectable({
  providedIn: 'root'
})
export class LogsGeralService {
  private readonly _BASE_URL: string = ''; // SpInfra2ConfigErpWS

  private readonly _HTTP_HEADERS: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private _httpClient: HttpClient,
    private _customEnvironmentService: LibCustomConfigERPEnvironmentService
  ) {
    this._BASE_URL = `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraLogGeral`; // SpInfra2ConfigErpWS
    this._BASE_URL = !this._customEnvironmentService.production ? this._BASE_URL : `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraLogGeral`;
  }

  // #region ==========> SERVICE METHODS <==========

  // #region Get
  getLog(id: number): Observable<RetLogGeral> {

    const params = new HttpParams()
      .set('id', id);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const url = `${this._BASE_URL}/Get`;

    return this._httpClient
      .get<RetLogGeral>(url, { 'params': params, 'headers': headers })
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
  getLogsList(search: SearchLogGeral): Observable<RetLogsGeral> {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const url = `${ this._BASE_URL }/GetLogsList`;

    return this._httpClient
      .post<RetLogsGeral>(url, JSON.stringify(search),{ 'headers': headers })
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
