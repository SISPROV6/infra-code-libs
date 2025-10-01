import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RetRecordsCombobox } from 'ngx-sp-infra';
import { Observable, take, tap } from 'rxjs';

import { LibCustomConfigERPEnvironmentService } from '../../../custom/lib-custom-configerp-environment.service';
import { InfraAuthentication } from '../models/InfraAuthentication';
import { RetInfraAuthentication } from '../models/RetInfraAuthentication';
import { RetRadioOptions } from '../models/RetRadioOptions';

@Injectable({
  providedIn: 'root'
})

export class InfraAuthenticationService {

  private readonly _BASE_URL: string = '';

  constructor(
    private httpClient: HttpClient,
    private _customEnvironmentService: LibCustomConfigERPEnvironmentService
  ) {
    this._BASE_URL = `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraAuthentication`; // SpInfra2ConfigErpWS
    this._BASE_URL = !this._customEnvironmentService.production ? this._BASE_URL : `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraAuthentication`;
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
