import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetError } from 'ngx-sp-infra';
import { Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestingService {

  // #region PRIVATE

  private readonly _BASE_URL: string = `https://pokeapi.co/api/v2/pokemon?limit=100&offset=0`;
  private readonly _HTTP_HEADERS = new HttpHeaders().set('Content-Type', 'application/json');

  // #endregion PRIVATE

  
  constructor( private _http: HttpClient ) { }


  // #region ==========> API METHODS <==========

  // #region GET

  /** Método responsável pela busca de dados teste via API. */
  public getPokemons(): Observable<any> {
    const url = `${ this._BASE_URL }`;

    return this._http.get<any>(url, { 'headers': this._HTTP_HEADERS })
      .pipe(take(1), tap(response => this.showErrorMessage(response) ));
  }

  // #endregion GET

  // #endregion ==========> API METHODS <==========


  // #endregion ==========> UTILS <==========
  private showErrorMessage(response: RetError): void { if (response.Error) throw Error(response.ErrorMessage); }
  // #endregion ==========> UTILS <==========

}
