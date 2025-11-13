import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetError } from 'ngx-sp-infra';
import { Observable, take, tap } from 'rxjs';
import { LibCustomConfigERPEnvironmentService } from '../../../custom/lib-custom-configerp-environment.service';
import { EmailConfigTestModel } from '../models/EmailConfigTestModel';
import { InfraEmailCfgRecord } from '../models/InfraEmailCfgRecord';
import { RetInfraEmailCfg } from '../models/RetInfraEmailCfg';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesSmtpService {

  private readonly _BASE_URL_CONFIG_ERP: string = '';
  private readonly _BASE_URL_CRP: string = '';

  constructor(
    private httpClient: HttpClient,
    private _customEnvironmentService: LibCustomConfigERPEnvironmentService
  ) {
    this._BASE_URL_CONFIG_ERP = `${ this._customEnvironmentService.Sp2LocalhostWS }/ConfigSMTP`; // SpInfra2ConfigErpWS
    this._BASE_URL_CONFIG_ERP = !this._customEnvironmentService.production ? this._BASE_URL_CONFIG_ERP : `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/ConfigSMTP`;

    this._BASE_URL_CRP = `${ this._customEnvironmentService.SpCrp2InfraWS }/InfraEmailCfg`; // SpCrp2InfraWS
    this._BASE_URL_CRP = !this._customEnvironmentService.production ? this._BASE_URL_CRP : `${ this._customEnvironmentService.SpCrp2InfraWS }/InfraEmailCfg`;
  }

  GetInfraEmail(modulo: string, TENANT_ID: number, infraEstabId: string): Observable<RetInfraEmailCfg> {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    
    let url;
    let params;

    if(modulo === 'Corporativo')
    {
      url = `${this._BASE_URL_CRP}/GetInfraEmail`;
      params = new HttpParams()
        .set('TENANT_ID', TENANT_ID)
        .set('infraEstabId', infraEstabId);
    }
    else
    {
      url = `${this._BASE_URL_CONFIG_ERP}/GetInfraEmail`;
      params = new HttpParams()
        .set('TENANT_ID', TENANT_ID)
    }

    return this.httpClient.get<RetInfraEmailCfg>(url, {'params': params, 'headers': headers })
      .pipe(take(1),tap(response => {if (response.Error) {throw Error(response.ErrorMessage)}}));
  }

  SalvarCfgEmail(modulo: string, record: InfraEmailCfgRecord): Observable<RetInfraEmailCfg > {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    let url = '';
    if(modulo === 'Corporativo')
    {
      url = `${this._BASE_URL_CRP}/SalvarCfgEmail`;
    }
    else
    {
      url = `${this._BASE_URL_CONFIG_ERP}/SalvarCfgEmail`;
    }

    return this.httpClient.post<RetInfraEmailCfg>(url, record,{ 'headers': headers })
      .pipe(take(1),tap(response => {if (response.Error) { throw Error(response.ErrorMessage) }}));
  }

  UpdateSenha(modulo: string, senha: string, ID:number): Observable<RetInfraEmailCfg > {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    let url = '';
    if(modulo === 'Corporativo')
    {
      url = `${this._BASE_URL_CRP}/UpdateSenha`;
    }
    else
    {
      url = `${this._BASE_URL_CONFIG_ERP}/UpdateSenha`;
    }

    const params = new HttpParams()
    .set('senha', senha)
    .set('ID', ID);

    return this.httpClient.post<RetInfraEmailCfg>(url, null,{'params': params, 'headers': headers })
      .pipe(take(1),tap(response => {if (response.Error) {throw Error(response.ErrorMessage);}}))
  }

  SendEmailConfigTest(modulo: string, emailConfigTest: EmailConfigTestModel  ): Observable<RetError> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    let url = '';
    if(modulo === 'Corporativo')
    {
      url = `${this._BASE_URL_CRP}/SendEmailConfigTest`;
    }
    else
    {
      url = `${this._BASE_URL_CONFIG_ERP}/SendEmailConfigTest`;
    }

    return this.httpClient.post<RetError>(url, emailConfigTest, { 'headers': headers })
      .pipe(take(1),tap(response => {if (response.Error) {throw Error(response.ErrorMessage)}}))
  }
}