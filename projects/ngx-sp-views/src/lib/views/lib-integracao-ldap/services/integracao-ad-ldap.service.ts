import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RetError, RetRecordsCombobox } from 'ngx-sp-infra';
import { Observable, take, tap } from 'rxjs';

import { LibCustomConfigERPEnvironmentService } from '../../../custom/lib-custom-configerp-environment.service';
import { InfraLDAP } from '../models/InfraLDAP';
import { LDAPValidateUser } from '../models/LDAPValidateUser';
import { RetInfraLDAP } from '../models/RetInfraLDAP';
import { RetUsuariosLDAP } from '../models/RetUsuariosLDAP';

@Injectable({
  providedIn: 'root'
})
export class IntegracaoAdLdapService {

  private readonly _BASE_URL: string = '';

  constructor(
    private httpClient: HttpClient,
    private _customEnvironmentService: LibCustomConfigERPEnvironmentService
  ) {
    this._BASE_URL = `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraLDAP`; // SpInfra2ConfigErpWS
    this._BASE_URL = !this._customEnvironmentService.production ? this._BASE_URL : `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraLDAP`;
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

  GetLDAPUsuariosList(): Observable<RetUsuariosLDAP> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const url = `${ this._BASE_URL }/GetLDAPUsuariosList`;

    return this.httpClient.get<RetUsuariosLDAP>(url, {'headers': headers })
    .pipe( take(1), tap(response => {if (response.Error) {throw Error(response.ErrorMessage)}}));
  }

  SetInfraConfigLDAP(id: string, isLDAP: boolean, idConfigLDAP: number): Observable<RetError> {
    const params = new HttpParams().set('id', id).set('isLDAP', isLDAP).set('idConfigLDAP', idConfigLDAP);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const url = `${ this._BASE_URL }/SetInfraConfigLDAP`;

    return this.httpClient.post<RetError>(url, null, { 'params': params, 'headers': headers })
    .pipe( take(1), tap(response => {if (response.Error) {throw Error(response.ErrorMessage)}}));
  }

}
