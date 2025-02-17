/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TableComponent } from '../../table/table.component';
import { RecordCombobox } from '../../../models/combobox/record-combobox';

@Component({
  selector: 'lib-inner-list',
  templateUrl: './inner-list.component.html',
  styleUrl: './inner-list.component.scss'
})
export class InnerListComponent {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _recordsList: RecordCombobox[] = [];

  private _page: number = 1;
  private _itemsPerPage: number = 5;
  // #endregion PRIVATE

  // #region PROTECTED
  protected textoPesquisa: string = "";
  // #endregion PROTECTED

  // #region PUBLIC
  @Input({ required: true}) paginationID!: string;

  @Input() counts?: number[] = [ 5, 10, 20 ];
  @Input() title?: string = "Lista de opções";
  @Input() identifierColumn?: string;
  @Input() labelColumn?: string;

  @Input() searchPlaceholder?: string = "";
  @Input() useSearch?: boolean = true;
  @Input() useSelection?: boolean = true;

  @Input()
  public get list(): RecordCombobox[] { return this._recordsList; }
  public set list(value: RecordCombobox[]) {
    this._recordsList = value;
    this.selecaoMap = this.initSelecao(value);
    this.updateSelected();
  }
  
  @Output() selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  
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

  // ngOnChanges(changes: SimpleChanges): void {
  //   // 
  // }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> UTILS <==========
  public updateSelected(): void {
   this.selected = [];
   this.selecaoMap.forEach((selected, id) => {
      if (selected) {
        const item = this.list.find(item => item.ID === id);
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
    if (this.list && list) {
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
  
  // #endregion ==========> UTILS <==========

}
