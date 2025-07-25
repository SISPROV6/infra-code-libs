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
}
