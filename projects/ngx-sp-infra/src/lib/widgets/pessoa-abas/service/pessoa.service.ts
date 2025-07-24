import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { RetPapeis } from '../models/RetPapeis';
import { RetTipoPessoa } from '../models/RetTipoPessoa';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private readonly PAPEL_BASE_URL: string = window.location.hostname.includes('localhost') ? `http://localhost:44384/api/Papeis` : `https://${ window.location.hostname }/SisproErpCloud/Service_Private/Corporativo/SpCrp2CrpPessoaWS/api/Papeis`;

  private readonly PESSOA_BASE_URL: string = window.location.hostname.includes('localhost') ? `http://localhost:44384/api/Pessoas` : `https://${ window.location.hostname }/SisproErpCloud/Service_Private/Corporativo/SpCrp2CrpPessoaWS/api/Pessoas`;

  constructor(private _httpClient: HttpClient) {
  }

  GetPapeisSelected(idCrpPessoa: string | number): Observable<RetPapeis> {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('idCrpPessoa', idCrpPessoa)

    const url = `${this.PAPEL_BASE_URL}/GetPapeisSelected`

    return this._httpClient
      .get<RetPapeis>(url, { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap(response => {

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

        })
      );

  }

  GetTipoPessoa(idCrpPessoa: string | number): Observable<RetTipoPessoa> {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('idCrpPessoa', idCrpPessoa)

    const url = `${this.PESSOA_BASE_URL}/TipoPessoa`

    return this._httpClient
      .get<RetTipoPessoa>(url, { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap(response => {

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

        })
      );

  }
}
