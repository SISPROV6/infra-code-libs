import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { RetValidAcesso } from '../models/RetValidAcesso';

@Injectable({
  providedIn: 'root'
})
export class EstabelecimentoService {

  private readonly GENERICS_BASE_URL: string = window.location.hostname.includes('localhost') ? `http://localhost:44384/api/Generics` : `https://${ window.location.hostname }/SisproErpCloud/Service_Private/Infra/SpInfra2ErpWS/api/Generics`;

  constructor(private _httpClient: HttpClient) { }

  GetValidAcesso_NoAbortTransaction(PageName: string, SpaceName: string): Observable<RetValidAcesso> {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('PageName', PageName)
      .set('SpaceName', SpaceName)

    const url = `${this.GENERICS_BASE_URL}/getValidAcesso_NoAbortTransaction`

    return this._httpClient
      .get<RetValidAcesso>(url, { 'params': params, 'headers': headers })
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
