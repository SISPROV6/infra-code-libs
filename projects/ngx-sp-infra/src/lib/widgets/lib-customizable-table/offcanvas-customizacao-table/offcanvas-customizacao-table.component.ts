import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { cloneDeep } from 'lodash';
import { DndDropEvent, DndModule } from 'ngx-drag-drop';

import { TableHeaderStructure } from '../../../models/table/header-structure.model';
import { ColunasTextSearchPipe } from '../../../pipes/colunas-text-search.pipe';
import { LibIconsComponent } from '../../lib-icons/lib-icons.component';

@Component({
  selector: 'lib-offcanvas-customizacao-table',
  imports: [
    LibIconsComponent,
    FormsModule,
    ColunasTextSearchPipe,
    DndModule
  ],
  templateUrl: './offcanvas-customizacao-table.component.html',
  styles: `
    @use "../../../styles/styles.scss" as *;

    .dndPlaceholder { background-color: #F5F5F5; }

    .dndList {
      transition: all 300ms ease !important;

      &.dndDragover {
        padding: .5rem !important;
      }
    }

    .border-dotted { border-style: dashed !important; }
    .cursor-grab { cursor: grab !important; }
  `
})
export class OffcanvasCustomizacaoTableComponent implements OnInit {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _draggedRow?: TableHeaderStructure;
  private _droppedRow?: TableHeaderStructure;

  private _draggedIndex: number = -1;
  private _droppedIndex: number = -1;
  // #endregion PRIVATE

  // #region PUBLIC
  @Input({ required: true }) public colunasVisiveis: TableHeaderStructure[] = [];

  @Output() public colunasModificadas: EventEmitter<TableHeaderStructure[]> = new EventEmitter<TableHeaderStructure[]>();
  
  public colunasPesquisa: string = "";
  public colunas: TableHeaderStructure[] = [];
  public colunaAcoes?: TableHeaderStructure;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor() { }

  ngOnInit(): void {
    let currOrder = 1;
    let tempRows: TableHeaderStructure[] = this.colunasVisiveis
      .filter(e => e.name !== '')
      .map((e, index) => ({
        ...e,
        isVisible: true,
        order: currOrder + index
      }));

    this.colunaAcoes = cloneDeep(this.colunasVisiveis.find(col => col.name === ""));
    this.colunas = cloneDeep([ ...tempRows ]);
  }


  // #region ==========> UTILS <==========
  public toggleAllColunas(visivel: boolean): void {
    this.colunas.forEach(coluna => coluna.isVisible = visivel);
  }

  public applyChanges(): void {
    if (this.colunaAcoes && !this.colunas.includes(this.colunaAcoes)) this.colunas.push(this.colunaAcoes);

    this.colunasModificadas.emit(this.colunas);
  }


  public trackBy(index: number, item: TableHeaderStructure): any {
    return index + item.name + item.widthClass + item.customClasses + item.orderColumn + item.col;
  }


  // #region Métodos drag-drop
  onStart(index: number, list: TableHeaderStructure[]): void {
    this._draggedRow = list[index];
    this._draggedIndex = index;
  }
  onEnd(): void {
    this._draggedRow = undefined;
    this._droppedRow = undefined;

    this._draggedIndex = -1;
    this._droppedIndex = -1;
  }
  
  onDrop(event: DndDropEvent, list: TableHeaderStructure[]): void {
    if (event.dropEffect !== 'copy' && event.dropEffect !== 'move') return;

    let targetIndex = (typeof event.index === 'number') ? event.index : list.length;
    const item = list[this._draggedIndex];
    
    this._droppedRow = list[targetIndex];
    this._droppedIndex = targetIndex;

    // Se arrastou para baixo (draggedIndex < targetIndex), 
    // ao remover o item original o índice de destino cai em 1
    if (this._draggedIndex < targetIndex) {
      targetIndex--;
    }
    
    // Remove o item prévio
    list.splice(this._draggedIndex, 1);
    
    // Adiciona o novo na posição nova
    list.splice(targetIndex, 0, item);
  }
  // #endregion Métodos drag-drop

  // #endregion ==========> UTILS <==========

}
