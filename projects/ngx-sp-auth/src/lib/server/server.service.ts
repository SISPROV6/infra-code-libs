import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take, tap } from 'rxjs';

import { RetServerConfig } from './ret-server-config';

@Injectable({
  providedIn: 'root'
})
export class ServerService {


  // private readonly _HOSTNAME: any = window.location.hostname.includes("localhost")
  //   ? `http://${window.location.hostname}`
  //   : `https://${window.location.hostname}`;

  private readonly _HOSTNAME: any = "https://siscandesv6.sispro.com.br";

  private readonly _BASE_URL: string = `${this._HOSTNAME}/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigWS/api/Config`;
  private readonly _HTTP_HEADERS = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private _httpClient: HttpClient) {
    this._BASE_URL.includes("localhost") || this._BASE_URL.includes('127.0.0.1')
      ? this._BASE_URL
      : this._BASE_URL = "https://siscandesv6.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigWS/api/Config";
  }

  // #region GET Server
  public getServer(): Observable<RetServerConfig> {
    const url = `${this._BASE_URL}/GetConfig`;

    return this._httpClient
      .post<RetServerConfig>(url, null, { 'headers': this._HTTP_HEADERS })
      .pipe(
        take(1),
        tap(response => {
          localStorage.setItem('configServerUser', response.User);
          localStorage.setItem('configServerPassword', response.Password);
        })
      )
  }
  // #endregion GET Server
}
