import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FiltrosAplicadosModel } from '../../models/filtros-aplicados/filtros-aplicados.model';
import { FormatByTypePipe } from '../../pipes/format-by-type.pipe';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

@Component({
    selector: 'lib-applied-filters',
    templateUrl: './applied-filters.component.html',
    styleUrl: './applied-filters.component.scss',
    
    imports: [NgIf, TooltipModule, LibIconsComponent, FormatByTypePipe]
})
export class AppliedFiltersComponent {

  // #region ==========> PROPERTIES <==========

  // #region PROTECTED
  protected get Array(): typeof Array { return Array; }

  public filtrosAplicadosInterno?: FiltrosAplicadosModel[] = [];
  // #endregion PROTECTED

  // #region PUBLIC
  @Input({ required: true })
  public get filtrosAplicados(): FiltrosAplicadosModel[] | undefined { return this.filtrosAplicadosInterno; }
  public set filtrosAplicados(value: FiltrosAplicadosModel[] | undefined) {
    
    // Aqui eu estou criando uma cópia dos valores que são recebidos
    // pois quando usamos a mesma referência do objeto original ele sempre se alterará com base no valor do original,
    // não importa quantas cópias existam
    this.filtrosAplicadosInterno = value ? value.map(obj => ({ ...obj })) : undefined;
  }
  
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
    this.removeFilter.emit({ control: control, value: this.valueToReset });

    const todosVazios = this.filtrosAplicadosInterno?.every(f => f.value === this.valueToReset);
    if (todosVazios) delete this.filtrosAplicadosInterno;
  }
  // #endregion ==========> UTILS <==========

}
