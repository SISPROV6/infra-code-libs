import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetError } from 'ngx-sp-infra';
import { delay, Observable, of, take, tap } from 'rxjs';


export interface Item {
  id: string;
  name: string;
  category: string;
  value: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}


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



  public getTableRecords(): Observable<Item[]> {
    return of([
      { id: "A100", name: "Item 01", category: "Alpha", value: 10, active: true, createdAt: "2024-01-01", updatedAt: "2024-02-01" },
      { id: "A100", name: "Item 02", category: "Alpha", value: 20, active: false, createdAt: "2024-01-02", updatedAt: "2024-02-02" },
      { id: "A100", name: "Item 03", category: "Alpha", value: 30, active: true, createdAt: "2024-01-03", updatedAt: "2024-02-03" },
      { id: "A200", name: "Item 04", category: "Beta", value: 12, active: true, createdAt: "2024-01-04", updatedAt: "2024-02-04" },
      { id: "A200", name: "Item 05", category: "Beta", value: 22, active: false, createdAt: "2024-01-05", updatedAt: "2024-02-05" },
      { id: "A300", name: "Item 06", category: "Gamma", value: 15, active: true, createdAt: "2024-01-06", updatedAt: "2024-02-06" },
      { id: "A300", name: "Item 07", category: "Gamma", value: 25, active: true, createdAt: "2024-01-07", updatedAt: "2024-02-07" },
      { id: "A300", name: "Item 08", category: "Gamma", value: 35, active: false, createdAt: "2024-01-08", updatedAt: "2024-02-08" },
      { id: "A300", name: "Item 09", category: "Gamma", value: 45, active: false, createdAt: "2024-01-09", updatedAt: "2024-02-09" },
      { id: "A999", name: "Item 10", category: "Omega", value: 99, active: true, createdAt: "2024-01-10", updatedAt: "2024-02-10" },

      // --- unique ones ---
      { id: "U001", name: "Item 11", category: "Delta", value: 17, active: true, createdAt: "2024-01-11", updatedAt: "2024-02-11" },
      { id: "U002", name: "Item 12", category: "Zeta", value: 27, active: true, createdAt: "2024-01-12", updatedAt: "2024-02-12" },
      { id: "U003", name: "Item 13", category: "Eta", value: 33, active: false, createdAt: "2024-01-13", updatedAt: "2024-02-13" },
      { id: "U004", name: "Item 14", category: "Theta", value: 44, active: true, createdAt: "2024-01-14", updatedAt: "2024-02-14" },
      { id: "U005", name: "Item 15", category: "Lambda", value: 18, active: true, createdAt: "2024-01-15", updatedAt: "2024-02-15" },
      { id: "U006", name: "Item 16", category: "Sigma", value: 28, active: false, createdAt: "2024-01-16", updatedAt: "2024-02-16" },
      { id: "U007", name: "Item 17", category: "Psi", value: 38, active: true, createdAt: "2024-01-17", updatedAt: "2024-02-17" },
      { id: "U008", name: "Item 18", category: "Phi", value: 48, active: false, createdAt: "2024-01-18", updatedAt: "2024-02-18" },
      { id: "U009", name: "Item 19", category: "Chi", value: 58, active: true, createdAt: "2024-01-19", updatedAt: "2024-02-19" },
      { id: "U010", name: "Item 20", category: "Tau", value: 68, active: false, createdAt: "2024-01-20", updatedAt: "2024-02-20" },

      // 30 more records
      ...Array.from({ length: 30 }).map((_, i) => ({
        id: `U${100 + i}`,
        name: `Item ${21 + i}`,
        category: ["Alpha", "Beta", "Gamma", "Delta", "Omega"][i % 5],
        value: 10 + i,
        active: i % 2 === 0,
        createdAt: `2024-02-${(i % 28) + 1}`,
        updatedAt: `2024-03-${(i % 28) + 1}`
      }))
    ]
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
