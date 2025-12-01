import { OnInit } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BasicFilters } from '../../models/filters/basic-filters';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-search-filters, lib-basic-filters',
    templateUrl: './search-filters.component.html',
    styleUrls: ['./search-filters.component.scss'],

    imports: [LibIconsComponent, FormsModule, NgIf, NgClass]
})
export class SearchFiltersComponent implements OnInit {

  constructor(private _breakpointObserver: BreakpointObserver) { }


  ngOnInit(): void {
    this.initMobileObserver();
  }
  // #region ==========> PROPERTIES <==========

  // #region PRIVATE

  /** Evento emitido quando o botão 'Pesquisar' ou 'Limpar' forem clicados. Retornam o valor da pesquisa, seja ela apenas a pesquisa de texto ou a pesquisa e o checkbox de status.
   * @returns Se a propriedade 'useIsActive' estiver false retorna´ra uma string, caso estiver true (valor padrão ou explícito) retornará a estrutura 'BasicFilters'. */
  @Output() private _executeGetBySearch: EventEmitter<string | BasicFilters> = new EventEmitter<string | BasicFilters>();

  /** Evento emitido quando o botão de 'Limpar' for clicado. Serve para sinalizar o compoenente pai que deve limpar o valor de quaisquer inputs customizados que foram adicionados por meio do <ng-content>. */
  @Output() private readonly _EMIT_CLEAR_EXTRA_INPUT: EventEmitter<void> = new EventEmitter<void>();

  private _isMobile: boolean = false;
  // #endregion PRIVATE

  // #region PUBLIC

  /** Placeholder a ser exibido no campo de pesquisa de texto. */
  @Input() public placeholder: string = '';

  /** Informa se o componente utilizará o checkbox de status ou não. Esta informação influencia no tipo de retorno do evento '_executeGetBySearch'. */
  @Input() public useIsActive?: boolean = true;

  /** [EXPERIMENTAL] Valores externos do filtro de pesquisa, ainda em fase de testes, servirão para compartilhar os mesmos valores da pesquisa entre componente pai e filho sem a necessidade de '@Inputs' e '@Outputs'. */
  @Input() public basicFilters: BasicFilters = new BasicFilters();

  public search: string = '';
  public selected: unknown;
  public isActive: boolean = true;
  public get isMobile(){ return this._isMobile }
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> UTILITIES <==========
  public applyFilters(): void {
    if (this.useIsActive && this.useIsActive === true) {
      const basicFilters: BasicFilters = {
        TEXTO_PESQUISA: this.search.trim(),
        IS_ATIVO: this.isActive
      };

      this._executeGetBySearch.emit(basicFilters);
    }
    else {
      this._executeGetBySearch.emit(this.search.trim());
    }
  }

  public clearFilters() {
    this.search = '';
    this.isActive = true;
    this.selected = '';
    this._EMIT_CLEAR_EXTRA_INPUT.emit();
    this.applyFilters();
  }


  public syncFilters(): void {
    this.basicFilters.TEXTO_PESQUISA = this.search.trim();
    this.basicFilters.IS_ATIVO = this.isActive;
  }

  public initMobileObserver(){
      this._breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this._isMobile = true;
      }
    });
  }
  // #endregion ==========> UTILITIES <==========

}
