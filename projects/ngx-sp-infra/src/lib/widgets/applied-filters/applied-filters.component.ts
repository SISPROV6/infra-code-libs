import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FiltrosAplicadosModel } from '../../models/filtros-aplicados/filtros-aplicados.model';

@Component({
  selector: 'lib-applied-filters',
  templateUrl: './applied-filters.component.html',
  styleUrl: './applied-filters.component.scss'
})
export class AppliedFiltersComponent {

  // #region ==========> PROPERTIES <==========

  // #region PROTECTED
  protected get Array(): typeof Array { return Array; }
  // #endregion PROTECTED

  // #region PUBLIC
  @Input({ required: true }) filtrosAplicados?: FiltrosAplicadosModel[];
  @Input({ required: true }) aliasNames: string[] = [];
  
  @Input() valueToReset: null | string = null;
  @Input() theme: string = "primary";

  @Output() removeFilter: EventEmitter<{ control: string, value: null | string }> = new EventEmitter<{ control: string, value: null | string }>();
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor() { }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> UTILS <==========
  public clearFilter(control: string) {
    this.removeFilter.emit({ control: control, value: this.valueToReset })
  }
  // #endregion ==========> UTILS <==========

}
