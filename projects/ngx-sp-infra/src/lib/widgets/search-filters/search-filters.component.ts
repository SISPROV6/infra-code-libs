import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BasicFilters } from '../../models/basic-filters';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent {

  constructor() { }


  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  @Output() private _executeGetBySearch: EventEmitter<any> = new EventEmitter<any>();

  @Output() private readonly _EMIT_CLEAR_EXTRA_INPUT: EventEmitter<void> = new EventEmitter<void>();
  // #endregion PRIVATE
  
  // #region PUBLIC
  @Input() public placeholder: string = '';
  @Input() public useIsActive: boolean = true;
  @Input() public useNewStyles: boolean = false;

  // VERIFICAR NECESSIDADE
  @Input() public basicFilters: BasicFilters = new BasicFilters();
  
  search: string = '';
  selected: any ;
  isActive: boolean = true;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> UTILITIES <==========
  public executeGetBySearch(): void {
    if (this.useIsActive) {
      const basicFilters: BasicFilters = {
        TEXTO_PESQUISA: this.search.trim(),
        IS_ATIVO: this.isActive
      };

      // VERIFICAR NECESSIDADE
      this.basicFilters.TEXTO_PESQUISA = this.search.trim();
      this.basicFilters.IS_ATIVO = this.isActive;

      this._executeGetBySearch.emit(basicFilters);

    } else {
      this._executeGetBySearch.emit(this.search.trim());
    }
  }

  clearFilters() {
    this.search = '';
    this.isActive = true;
    this.selected = '';
    this._EMIT_CLEAR_EXTRA_INPUT.emit();
    this.executeGetBySearch();
  }
  
  // #endregion ==========> UTILITIES <==========


}
