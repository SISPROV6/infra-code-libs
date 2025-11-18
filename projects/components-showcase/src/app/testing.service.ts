import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetError } from 'ngx-sp-infra';
import { delay, Observable, of, take, tap } from 'rxjs';

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

  public getPokemonsStatic(filter: string = ""): Observable<any> {
    console.log('getPokemonsStatic()', filter);
    
    return of([
      { ID: 1, LABEL: 'Pikachu' },
      { ID: 2, LABEL: 'Bulbasaur' },
      { ID: 3, LABEL: 'Charmander' },
      { ID: 4, LABEL: 'Vulpix' },
      { ID: 5, LABEL: 'Umbreon' },
      { ID: 6, LABEL: 'Eevee' },
      { ID: 7, LABEL: 'Jolteon' },
      { ID: 8, LABEL: 'Glaceon' },
      { ID: 9, LABEL: 'Flareon' },
      { ID: 10, LABEL: '' },
      { ID: 11, LABEL: 'Vaporeon' },
      { ID: 12, LABEL: 'Mewtwo' },
      { ID: 13, LABEL: 'Machomp' },
      { ID: 14, LABEL: 'Lopunny' },
      { ID: 15, LABEL: 'Lucario' },
      { ID: 16, LABEL: 'Mew' },
    ].filter(e => e.LABEL.toLowerCase().includes(filter.toLowerCase()))
  ).pipe( delay(1500) );
  }

  /** Método para simular um retorno de objeto que preencherá um formulário. */
  public simulateRecord(): Observable<any> {
    return of({
      pokemon: 'vulpix'
    })
  }
  // #endregion GET

  // #endregion ==========> API METHODS <==========


  // #endregion ==========> UTILS <==========
  private showErrorMessage(response: RetError): void { if (response.Error) throw Error(response.ErrorMessage); }
  // #endregion ==========> UTILS <==========

}
