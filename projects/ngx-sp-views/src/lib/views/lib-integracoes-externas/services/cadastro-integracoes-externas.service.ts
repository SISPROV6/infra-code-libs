import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take, tap } from "rxjs";

import { IntegrationAzureSSOForm } from "../models/3Rn/IntegrationAzureSSOForm";

import { RetError } from "ngx-sp-infra";
import { RetIntegracaoAzureSSO } from "../models/2Ws/RetIntegracaoAzureSSO";

@Injectable({
  providedIn: 'root'
})
export class CadastroIntegracoesExternasService {

  private readonly _BASE_URL: string = window.location.hostname.includes('localhost')
    ? `https://siscandesV6.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraIntegration`
    : `https://${window.location.hostname}/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraIntegration`;

  //  private readonly _BASE_URL: string = "http://localhost:44384/api/InfraIntegration";

  constructor(private _httpClient: HttpClient) {
  }


  GetInfraIntegracaoAzureSSO(tenant_id: number): Observable<RetIntegracaoAzureSSO> {

    const headers = new HttpHeaders().set("Content-Type", "application/json");

    const params = new HttpParams().set("Tenant_id", tenant_id);

    const url = `${this._BASE_URL}/GetIntegracaoAzureSSO`;

    return this._httpClient
      .get<RetIntegracaoAzureSSO>(url, { params: params, headers: headers })
      .pipe(
        take(1),
        tap((response) => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      );
  }

  CreateOrUpdateIntegracaoAzureSSO(record: IntegrationAzureSSOForm): Observable<RetError> {

    const headers = new HttpHeaders().set("Content-Type", "application/json");

    const url = `${this._BASE_URL}/CreateOrUpdateIntegracaoAzureSSO`;

    return this._httpClient
      .post<RetError>(url, record, { headers: headers })
      .pipe(
        take(1),
        tap((response) => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      );
  }

}
