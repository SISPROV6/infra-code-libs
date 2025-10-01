import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { RetError } from "ngx-sp-infra";
import { Observable, take, tap } from "rxjs";

import { LibCustomConfigERPEnvironmentService } from "../../../custom/lib-custom-configerp-environment.service";
import { RetIntegracaoAzureSSO } from "../models/2Ws/RetIntegracaoAzureSSO";
import { IntegrationAzureSSOForm } from "../models/3Rn/IntegrationAzureSSOForm";

@Injectable({
  providedIn: 'root'
})
export class CadastroIntegracoesExternasService {

  private readonly _BASE_URL: string = '';

  //  private readonly _BASE_URL: string = "http://localhost:44384/api/InfraIntegration";

  constructor(
    private _httpClient: HttpClient,
    private _customEnvironmentService: LibCustomConfigERPEnvironmentService
  ) {
    this._BASE_URL = `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraIntegration`; // SpInfra2ConfigErpWS
    this._BASE_URL = !this._customEnvironmentService.production ? this._BASE_URL : `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/InfraIntegration`;
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
