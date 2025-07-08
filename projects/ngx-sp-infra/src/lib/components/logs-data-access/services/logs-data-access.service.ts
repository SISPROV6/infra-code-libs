import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take, tap } from 'rxjs';


import { RetLogDataAccess } from '../models/ret-log-data-access';
import { RetLogsDataAccess } from '../models/ret-logs-data-access';
import { SearchLogDataAccess } from '../models/search-log-data-access';

@Injectable({
  providedIn: 'root'
})
export class LogsDataAccessService {
      private readonly _BASE_URL: string = window.location.hostname.includes('localhost') ? `https://SiscanDesV6.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraLogDataAccess` : `https://${ window.location.hostname }/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraLogDataAccess`; // SpInfra2ConfigErpWS


  private readonly _HTTP_HEADERS: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private _httpClient: HttpClient) {
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
