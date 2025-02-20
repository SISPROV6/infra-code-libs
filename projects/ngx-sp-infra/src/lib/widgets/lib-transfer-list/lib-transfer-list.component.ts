/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecordCombobox } from './../../models/combobox/record-combobox';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { TransferListConfig } from '../../models/transfer-list/list-transfer-config.model';

import { Utils } from '../../utils/utils';
import { InnerListComponent } from './inner-list/inner-list.component';

@Component({
  selector: 'lib-transfer-list',
  templateUrl: './lib-transfer-list.component.html',
  styleUrl: './lib-transfer-list.component.scss'
})
export class LibTransferListComponent implements OnInit, OnChanges {

  // #region ==========> PROPERTIES <==========
  
  // #region PROTECTED
  protected availableListID: string = "";
  protected selectedListID: string = "";
  // #endregion PROTECTED

  // #region PUBLIC
  @Input({ required: true }) completeList!: RecordCombobox[];
  
  @Input({ required: true }) availableListConfig!: TransferListConfig;
  @Input({ required: true }) selectedListConfig!: TransferListConfig;
  
  @Input() direction: "row" | "column" = "row";
  @Input() oneWay: boolean = false;

  @Input() useBackendSearch?: boolean = false;
  
  @Output() firstListChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() secondListChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Output() emitSearch: EventEmitter<string> = new EventEmitter<string>();
  
  @ViewChild('firstList') firstListComponent?: InnerListComponent;
  @ViewChild('secondList') secondListComponent?: InnerListComponent;
  
  
  public firstListSelected: any[] = [];
  public secondListSelected: any[] = [];

  public get iconDirections(): "row" | "column" { return this.direction === 'row' ? 'column' : 'row'; }
  public get selectIconName(): "seta-direita" | "seta-baixo" { return this.direction == 'row' ? 'seta-direita' : 'seta-baixo'; }
  public get revertIconName(): "seta-esquerda" | "seta-cima" { return this.direction == 'row' ? 'seta-esquerda' : 'seta-cima'; }

  public get isFirstListSelectionEmpty(): boolean { return this.firstListSelected.length === 0; }
  public get isSecondListSelectionEmpty(): boolean { return this.secondListSelected.length === 0; }

  public get firstListClass(): string {
    return !this.availableListConfig.customClass ?
      this.direction === "row" ?
        "col-6" : "col"
      : this.availableListConfig.customClass;
  }
  public get secondListClass(): string {
    return !this.selectedListConfig.customClass ?
      this.direction === "row" ?
        "col-5" : "col"
      : this.selectedListConfig.customClass;
  }
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor() { }

  ngOnInit(): void {
    this.inicializarIDs();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['availableListConfig'] || changes['selectedListConfig']) {
      this.inicializarListas();
    }
  }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> UTILS <==========
  private atualizarSelecoes(
    origem: any[],
    destino: any[],
    origemConfig: TransferListConfig,
    origemSelecionados: any[],
    componenteOrigem?: InnerListComponent,
    componenteDestino?: InnerListComponent,
  ): void {
    
    origemSelecionados.forEach(item => destino.push(item));
    // destino = [ ...origemSelecionados ];
    
    destino.sort((a, b) => Utils.alphanumericSort(a.ID, b.ID));
    
    origemSelecionados.forEach(selectedItem => {
      const index = origem.findIndex(item => item === selectedItem);
      if (index !== -1) origem.splice(index, 1);
    });

    // Limpa os selecionados
    origemSelecionados.length = 0;
    if (componenteOrigem) {
      componenteOrigem.selected = [];
      componenteOrigem.selecaoGeral = false;
      componenteOrigem.selecaoMap = componenteOrigem.initSelecao(origemConfig.list);

      // Reseta a paginação
      componenteOrigem.page = 1;
      componenteOrigem.filterList("");
    }
    if (componenteDestino) {
      componenteDestino.selected = [];
      componenteDestino.selecaoGeral = false;
      componenteDestino.selecaoMap = componenteDestino.initSelecao(destino);

      // Reseta a paginação
      componenteDestino.page = 1;
      componenteDestino.filterList("");
    }
    
    this.firstListChange.emit(this.availableListConfig.list);
    this.secondListChange.emit(this.selectedListConfig.list);
  }

  public selecionarRegistros(): void {
    this.atualizarSelecoes(this.availableListConfig.list,
      this.selectedListConfig.list,
      this.availableListConfig,
      this.firstListSelected,
      this.firstListComponent,
      this.secondListComponent);
  }

  public removerSelecao(): void {
    this.atualizarSelecoes(this.selectedListConfig.list,
      this.availableListConfig.list,
      this.selectedListConfig,
      this.secondListSelected,
      this.secondListComponent,
      this.firstListComponent);
  }


  private inicializarListas(): void {
    if (this.completeList && this.availableListConfig.list && this.selectedListConfig.list) {
      this.availableListConfig.list = this.completeList.filter(item => !this.selectedListConfig.list.some(selectedItem => selectedItem.ID === item.ID) );
    }

    if (this.firstListComponent && this.secondListComponent) {
      this.firstListComponent.itemsPerPage = this.firstListComponent.counts ? this.firstListComponent.counts[0] : 5;
      this.secondListComponent.itemsPerPage = this.secondListComponent.counts ? this.secondListComponent.counts[0] : 5;
    }
  }

  private inicializarIDs(): void {
    this.availableListID = `availableList_${Math.random() * 100}`;
    this.selectedListID = `selectedList_${Math.random() * 100}`;
  }
  // #endregion ==========> UTILS <==========

}
