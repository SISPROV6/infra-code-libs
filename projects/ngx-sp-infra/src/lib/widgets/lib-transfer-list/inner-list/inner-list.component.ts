/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { TableComponent } from '../../table/table.component';
import { RecordCombobox } from '../../../models/combobox/record-combobox';

@Component({
  selector: 'lib-inner-list',
  templateUrl: './inner-list.component.html',
  styleUrl: './inner-list.component.scss'
})
export class InnerListComponent implements OnChanges {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _recordsList: RecordCombobox[] = [];

  private _page: number = 1;
  private _itemsPerPage: number = 5;
  // #endregion PRIVATE

  // #region PROTECTED
  protected textoPesquisa: string = "";
  protected registrosFiltrados: RecordCombobox[] = [];
  // #endregion PROTECTED

  // #region PUBLIC
  @Input({ required: true}) side!: string;

  @Input({ required: true}) paginationID!: string;

  @Input() counts?: number[] = [ 5, 10, 20 ];
  @Input() title?: string = "Lista de opções";
  @Input() identifierColumn?: string;
  @Input() labelColumn?: string;

  @Input() searchPlaceholder?: string = "";
  
  @Input() useSearch?: boolean = true;
  @Input() useBackendSearch?: boolean = false;

  @Input() useSelection?: boolean = true;

  @Input()
  public get list(): RecordCombobox[] { return this._recordsList; }
  public set list(value: RecordCombobox[]) {
    this._recordsList = value;
    this.registrosFiltrados = value;

    this.selecaoMap = this.initSelecao(value);
    this.updateSelected();

    this.filterList("setter");
  }
  
  @Output() selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() emitSearch: EventEmitter<string> = new EventEmitter<string>();
  
  @ViewChild(TableComponent) public tableComponent?: TableComponent;
  
  
  public selected: any[] = [];
  
  public get page(): number { return this._page; }
  public set page(value: number) { this._page = value; }
  
  public get itemsPerPage(): number { return this._itemsPerPage; }
  public set itemsPerPage(value: number) { this._itemsPerPage = value; }
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor() { }

  // ngOnInit(): void {
  //   // 
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["list"].currentValue) {
      this.filterList("onChanges");
    }
  }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> UTILS <==========
  public filterList(origin: string): void {
    console.log(`${origin} | filtrou lado:`, this.side);
    
    if (!this.textoPesquisa) {
      this.registrosFiltrados = [ ...this.list ];
    }
    else {
      this.registrosFiltrados = this.list.filter(e => e.LABEL.toLocaleLowerCase().includes(this.textoPesquisa.toLocaleLowerCase()) 
        || e.ID.toLocaleString().toLocaleLowerCase().includes(this.textoPesquisa.toLocaleLowerCase())
        || (e.AdditionalStringProperty1 && e.AdditionalStringProperty1.toLocaleString().toLocaleLowerCase().includes(this.textoPesquisa.toLocaleLowerCase()))
        || (e.AdditionalStringProperty2 && e.AdditionalStringProperty2.toLocaleString().toLocaleLowerCase().includes(this.textoPesquisa.toLocaleLowerCase()))
      );
    }

    console.log(`${origin} | Lado: ${this.side} - list`, this.list);
    console.log(`${origin} | Lado: ${this.side} - registrosFiltrados`, this.registrosFiltrados);
  }


  public updateSelected(): void {
   this.selected = [];
   this.selecaoMap.forEach((selected, id) => {
      if (selected) {
        const item = this.registrosFiltrados.find(item => item.ID === id);
        if (item) this.selected.push(item);
      }
   });

   this.selectionChange.emit(this.selected);
}

  // #region SELEÇÃO
  private _selecaoGeral: boolean = false;

  public get selecaoGeral(): boolean { return this._selecaoGeral; }
  public set selecaoGeral(value: boolean) { this._selecaoGeral = value; }

  public selecaoMap: Map<string | number, boolean> = new Map<string, boolean>();


  public initSelecao(list?: RecordCombobox[]): Map<string | number, boolean> {
    this.selecaoMap = new Map();
    if (this.registrosFiltrados && list) {
      list.forEach(item => { this.selecaoMap.set(item.ID, false) });
    }
    this.selecaoGeral = false;
    
    return this.selecaoMap;
  }
  

  public inverterSelecao(id: string | number) {
    const selecionado = this.selecaoMap.get(id) || false;
    this.selecaoMap.set(id, !selecionado);

    // Define `selecaoGeral` como verdadeiro se todos os itens forem selecionados, senão, falso
    this.selecaoGeral = Array.from(this.selecaoMap.values()).every(Boolean);
  }

  public definirSelecaoTotal(list?: RecordCombobox[], selecao?: boolean) {
    this.selecaoGeral = selecao ?? false;

    if (list) {
      list.forEach(item => { this.selecaoMap.set(item.ID, selecao ?? false) });
    }
  }
  // #endregion SELEÇÃO



  public handleSearch(): void {
    if (this.useBackendSearch) this.emitSearch.emit(this.textoPesquisa);
    else this.filterList("handleSearch");
  }
  
  // #endregion ==========> UTILS <==========

}
