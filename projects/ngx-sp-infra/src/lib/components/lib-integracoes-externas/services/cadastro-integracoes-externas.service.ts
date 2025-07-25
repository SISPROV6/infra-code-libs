import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take, tap } from "rxjs";
import { RetIntegracoes } from "../models/2Ws/RetIntegracoes";
import { IntegracoesParameterRecord } from "../models/7Db/InfraIntegrationParameterRecord";
import { RetIntegracoesParameters } from "../models/2Ws/RetIntegracoesParameters";
import { RetInfraIntegracao } from "../models/2Ws/RetInfraIntegracao";
import { RetIntegracaoParameter } from "../models/2Ws/RetIntegracaoParameter";
import { RetText } from "../models/2Ws/RetText";
import { IntegracoesRecord } from "../models/7Db/IntegracoesRecord";
import { RetCreateInfraIntegration } from "../models/2Ws/RetCreateInfraIntegration";
import { RetNumber } from "../models/2Ws/RetNumber";

@Injectable({
  providedIn: 'root'
})
export class CadastroIntegracoesExternasService {

  private readonly _BASE_URL: string = window.location.hostname.includes('localhost')
    ? `https://siscandesV6.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraIntegration`
    : `https://${window.location.hostname}/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigErpWS/api/InfraIntegration`;

  constructor(private _httpClient: HttpClient) {
  }


  GetInfraIntegracao(id: number, Tenant_id: number): Observable<RetInfraIntegracao> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    const params = new HttpParams().set("id", id).set("Tenant_id", Tenant_id);

    const url = `${this._BASE_URL}/GetInfraIntegracao`;

    return this._httpClient
      .get<RetInfraIntegracao>(url, { params: params, headers: headers })
      .pipe(
        take(1),
        tap((response) => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      );
  }

  CreateInfraIntegration(InfraIntegracao: IntegracoesRecord): Observable<RetCreateInfraIntegration> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    const url = `${this._BASE_URL}/CreateInfraIntegracao`;

    return this._httpClient
      .post<RetCreateInfraIntegration>(url, InfraIntegracao, { headers: headers })
      .pipe(
        take(1),
        tap((response) => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      );
  }

  CreateInfraIntegrationParameter(InfraIntegracaoParameterList: IntegracoesParameterRecord[], infraIntegrationId: number, Tenant_Id: number): Observable<RetText> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    const params = new HttpParams().set("infraIntegrationId", infraIntegrationId).set("Tenant_Id", Tenant_Id)

    const url = `${this._BASE_URL}/CreateInfraIntegracaoParameter`;

    return this._httpClient
      .post<RetText>(url, InfraIntegracaoParameterList, { params: params, headers: headers })
      .pipe(
        take(1),
        tap((response) => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      );
  }

  UpdateInfraIntegrationParameter(Key: string, Value: string, Id: number, Tenant_Id: number): Observable<RetText> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    const params = new HttpParams().set("Key", Key).set("Value", Value).set("Id", Id).set("Tenant_Id", Tenant_Id)

    const url = `${this._BASE_URL}/UpdateIntegracaoParameter`;

    return this._httpClient
      .post<RetText>(url, null, { params: params, headers: headers })
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
