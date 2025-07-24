import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take, tap } from 'rxjs'

import { RetRecordsCombobox } from '../../../models/combobox/ret-records-combobox';
import { RetError } from '../../../models/utils/ret-error';

import { RetInfraLDAP } from '../models/RetInfraLDAP';
import { InfraLDAP } from '../models/InfraLDAP';
import { LDAPValidateUser } from '../models/LDAPValidateUser';

@Injectable({
  providedIn: 'root'
})
export class IntegracaoAdLdapService {

  private readonly _BASE_URL: string = window.location.hostname.includes('localhost')
    ? `https://siscandesV6.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraLDAP`
    : `https://${window.location.hostname}/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraLDAP`;

  constructor(private httpClient: HttpClient) {
  }

  TENANT_ID: number = 0;

  getByTenantId(): Observable<RetInfraLDAP> {
    const url = `${this._BASE_URL}/GetByTenantId`


    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');


    return this.httpClient.get<RetInfraLDAP>(url, { 'headers': headers })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage)
          }
        })
      )
  }

  GetGrupoDefaultIdList(): Observable<RetRecordsCombobox> {
    const url = `${this._BASE_URL}/GetGrupoDefaultIdList`


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

  createOrUpdate(record: InfraLDAP): Observable<RetInfraLDAP> {
    const url = `${this._BASE_URL}/CreateOrUpdate`
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.httpClient.post<RetInfraLDAP>(url, record, { 'headers': headers })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage)
          }
        })
      )
  }

  validateUserinLDAP(ldapValidateUser: LDAPValidateUser): Observable<RetError> {
    const url = `${this._BASE_URL}/ValidateUserinLDAP`
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.httpClient
      .post<RetError>(url, ldapValidateUser, { 'headers': headers })
      .pipe(
        take(1),
        tap((response) => {

          if (response.Error) {
            throw Error(response.ErrorMessage)
          }

        })
      );

  }

}
