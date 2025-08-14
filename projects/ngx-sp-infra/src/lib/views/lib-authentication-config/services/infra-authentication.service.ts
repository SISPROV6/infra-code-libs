import { Injectable } from '@angular/core';
import { InfraAuthentication } from './../models/InfraAuthentication';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { RetInfraAuthentication } from '../models/RetInfraAuthentication';
import { RetRecordsCombobox } from '../../../models/combobox/ret-records-combobox';
import { RetRadioOptions } from '../models/RetRadioOptions';

@Injectable({
  providedIn: 'root'
})

export class InfraAuthenticationService {

  private readonly _BASE_URL: string = window.location.hostname.includes('localhost')
    ? `https://siscandesV6.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraAuthentication`
    : `https://${window.location.hostname}/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraAuthentication`;

  constructor(private httpClient: HttpClient) {
  }

  GetInfraAuthenticationByTenant(): Observable<RetInfraAuthentication> {
    const url = `${this._BASE_URL}/GetInfraAuthenticationByTenant`

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')

    return this.httpClient.get<RetInfraAuthentication>(url, { 'headers': headers })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage)
          }
        })
      )
  }

  GetInfraIn2FaTypeCombobox(): Observable<RetRecordsCombobox> {
    const url = `${this._BASE_URL}/GetInfraIn2FaTypeCombobox`

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.httpClient.get<RetRecordsCombobox>(url, { 'headers': headers })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage)
          }
        })
      )
  }

  GetInfraInAuthTypeRadioButtons(): Observable<RetRadioOptions> {
    const url = `${this._BASE_URL}/GetInfraInAuthTypeRadioButtons`

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.httpClient.get<RetRadioOptions>(url, { 'headers': headers })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage)
          }
        })
      )
  }

  CreateOrUpdateAuthentication(record: InfraAuthentication): Observable<RetInfraAuthentication> {
    const url = `${this._BASE_URL}/CreateOrUpdateAuthentication`

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.httpClient.post<RetInfraAuthentication>(url, record, { 'headers': headers })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage)
          }
        })
      )
  }
}
