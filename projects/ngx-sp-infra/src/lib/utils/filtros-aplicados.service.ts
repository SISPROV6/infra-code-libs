import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, Subject, Subscription } from 'rxjs';

import { FiltrosAplicadosModel } from '../models/filtros-aplicados/filtros-aplicados.model';

@Injectable({
  providedIn: 'root'
})
export class FiltrosAplicadosService {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _subscription$?: Subscription;
  // #endregion PRIVATE

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor() { }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> UTILS <==========
  prepararBadgesForm(form: FormGroup): Observable<FiltrosAplicadosModel[]> {
    const appliedFiltersFormGroup = new Subject<FiltrosAplicadosModel[]>();

    
    // Evita múltiplas subscrições acumuladas
    if (this._subscription$) this._subscription$.unsubscribe();


    this._subscription$ = form.valueChanges.subscribe(() => {
      const controlArray = Object.entries(form.controls);
      const listaCompleta: FiltrosAplicadosModel[] = [];
  
      controlArray.forEach(([key, control]) => {
        listaCompleta.push({ label: key, value: control.value });
      });
  
      appliedFiltersFormGroup.next(listaCompleta);
    });
  
    return appliedFiltersFormGroup.asObservable();
  }
  // #endregion ==========> UTILS <==========

}
