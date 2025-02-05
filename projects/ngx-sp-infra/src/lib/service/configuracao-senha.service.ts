import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take, tap } from 'rxjs';

import { RetInfraSegConfig } from '../models/config-senha/2Ws/RetInfraSegConfig.model';
import { InfraSegConfig } from '../models/config-senha/7Db/InfraSegConfig.record';
import { RetError } from '../models/utils/ret-error';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoSenhaService {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private readonly _BASE_URL: string = `https://siscandesv6.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraSegConfig`; // SpInfra2ConfigErpWS
  private readonly _HTTP_HEADERS = new HttpHeaders().set('Content-Type', 'application/json');
  // #endregion PRIVATE

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor(private _httpClient: HttpClient) {  }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> SERVICE METHODS <==========

  // #region GET
  public getInfraSegConfig(tenantID: number): Observable<RetInfraSegConfig>{
    const params = new HttpParams().set('TENANT_ID', tenantID);

    const headers = this._HTTP_HEADERS;

    const url = `${this._BASE_URL}/Get`;

    return this._httpClient.get<RetInfraSegConfig>(url, { 'params': params, 'headers': headers })
      .pipe( take(1), tap(response => this.showErrorMessage(response)) );
  }
  // #endregion GET

  // #region POST
  public createOrUpdateInfraSegConfig(record: InfraSegConfig): Observable<RetInfraSegConfig> {
    const headers = this._HTTP_HEADERS;

    const url = `${this._BASE_URL}/Create`;

    return this._httpClient.post<RetInfraSegConfig>(url, record, { 'headers': headers })
      .pipe( take(1), tap(response => this.showErrorMessage(response)) );
  }
  // #endregion POST

  // #endregion ==========> SERVICE METHODS <==========


  // #region ==========> UTILS <==========
  private showErrorMessage(response: RetError): void { if (response.Error) throw Error(response.ErrorMessage); }
  // #endregion ==========> UTILS <==========

}
