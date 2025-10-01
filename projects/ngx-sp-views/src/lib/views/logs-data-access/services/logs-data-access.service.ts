import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take, tap } from 'rxjs';

import { LibCustomConfigERPEnvironmentService } from '../../../custom/lib-custom-configerp-environment.service';
import { RetLogDataAccess } from '../models/ret-log-data-access';
import { RetLogsDataAccess } from '../models/ret-logs-data-access';
import { SearchLogDataAccess } from '../models/search-log-data-access';

@Injectable({
  providedIn: 'root'
})
export class LogsDataAccessService {
  private readonly _BASE_URL: string = ''; // SpInfra2ConfigErpWS

  private readonly _HTTP_HEADERS: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private _httpClient: HttpClient,
    private _customEnvironmentService: LibCustomConfigERPEnvironmentService
  ) {
    this._BASE_URL = `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraLogDataAccess`; // SpInfra2ConfigErpWS
    this._BASE_URL = !this._customEnvironmentService.production ? this._BASE_URL : `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraLogDataAccess`;
  }

 // #region ==========> SERVICE METHODS <==========

 // #region Get
 getLog(id: number): Observable<RetLogDataAccess> {

   const params = new HttpParams()
     .set('id', id);

   const headers = new HttpHeaders()
     .set('Content-Type', 'application/json');

   const url = `${this._BASE_URL}/Get`;

   return this._httpClient
     .get<RetLogDataAccess>(url, { 'params': params, 'headers': headers })
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
 getLogsList(search: SearchLogDataAccess): Observable<RetLogsDataAccess> {

   const headers = new HttpHeaders()
     .set('Content-Type', 'application/json');

   const url = `${ this._BASE_URL }/GetLogsList`;

   return this._httpClient
     .post<RetLogsDataAccess>(url, JSON.stringify(search),{ 'headers': headers })
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
