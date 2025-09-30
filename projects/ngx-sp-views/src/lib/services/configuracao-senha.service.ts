import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take, tap } from 'rxjs';

import { InfraSegConfig, RetError, RetInfraSegConfig } from 'ngx-sp-infra';
import { AuthToken } from '../models/auth/auth-token.model';


@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoSenhaService {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE

  private readonly _BASE_URL: string = window.location.hostname.includes('localhost')
    ? `https://siscandesV6.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraSegConfig`
    : `https://${window.location.hostname}/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraSegConfig`;

  //private readonly _BASE_URL: string = `https://${ window.location.hostname }/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraSegConfig`; // SpInfra2ConfigErpWS
  private readonly _HTTP_HEADERS = new HttpHeaders()
    .set('Content-Type', 'application/json');

  private _authToken?: AuthToken = JSON.parse(localStorage["user_auth_v6"] ?? "{}");
  // #endregion PRIVATE

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor(private _httpClient: HttpClient) {
    this.validateLocalToken();
  }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> SERVICE METHODS <==========

  // #region GET
  public getInfraSegConfig(): Observable<RetInfraSegConfig> {
    const params = new HttpParams().set('TENANT_ID', this._authToken!.__tenantId);

    const headers = this._HTTP_HEADERS
      .set('Authorization', `Bearer ${this._authToken?.__authToken}`);

    const url = `${this._BASE_URL}/Get`;

    return this._httpClient.get<RetInfraSegConfig>(url, { 'params': params, 'headers': headers })
      .pipe(take(1), tap(response => this.showErrorMessage(response)));
  }
  // #endregion GET

  // #region POST
  public createOrUpdateInfraSegConfig(record: InfraSegConfig): Observable<RetInfraSegConfig> {
    const headers = this._HTTP_HEADERS
      .set('Authorization', `Bearer ${this._authToken?.__authToken}`);

    const url = `${this._BASE_URL}/Create`;

    return this._httpClient.post<RetInfraSegConfig>(url, record, { 'headers': headers })
      .pipe(take(1), tap(response => this.showErrorMessage(response)));
  }
  // #endregion POST

  // #endregion ==========> SERVICE METHODS <==========


  // #region ==========> UTILS <==========
  private showErrorMessage(response: RetError): void { if (response.Error) throw Error(response.ErrorMessage); }


  private validateLocalToken(): void {
    if (!this._authToken) throw new Error("Não há um token correto informado.");
  }
  // #endregion ==========> UTILS <==========

}
