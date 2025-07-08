import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { cloneDeep } from 'lodash';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';

import { TableHeaderStructure } from '../../models/table/header-structure.model';
import { Utils } from '../../utils/utils';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';
import { OrderingComponent } from '../ordering/ordering.component';
import { OffcanvasCustomizacaoTableComponent } from "./offcanvas-customizacao-table/offcanvas-customizacao-table.component";

@Component({
  selector: 'lib-customizable-table',
  imports: [
    NgIf,
    FormsModule,
    NgFor,
    NgClass,
    LibIconsComponent,
    TooltipModule,
    OrderingComponent,
    NgxPaginationModule,
    NgTemplateOutlet,
    OffcanvasCustomizacaoTableComponent
],
  templateUrl: './lib-customizable-table.component.html',
  styleUrl: './lib-customizable-table.component.scss'
})
export class LibCustomizableTableComponent implements OnInit, AfterViewInit, OnChanges {

  // #region ==========> PROPRIEDADES <==========

  // #region PRIVATE
  private _paginationID: string = "libTablePagination";
  private _recordsList: unknown[] | undefined;

  private _currentPage: number = 1;
  private _currentItemsPerPage: number = 0;
  // #endregion PRIVATE

  // #region PUBLIC
    /** Lista de registros a serem exibidos na tabela.
   * @required */
  @Input({ required: true })
  public get list(): any[] | undefined { return this._recordsList; }
  public set list(value: any[] | undefined) { this._recordsList = value; }

  /** Lista de cabeçalhos para as colunas da tabela, incluindo o nome, a largura da coluna e classes customizadas.
   * @see TableHeaderStructure
  */
  @Input({ required: true }) public headers!: TableHeaderStructure[];

  /** Opções de contagem de itens por página disponíveis para o usuário.
   * @required */
  @Input() public counts?: number[];

  /** Determina se haverá uma coluna inicial para seleção de registros na tabela. */
  @Input() public useSelection: boolean = false;

  /** Determina o número de registros selecionados. */
  @Input() public selectedCount?: number;

  @Input() public selection: boolean | undefined = false;

  /** Determina se a tabela deve usar paginação.
   * @default true */
  @Input() public usePagination: boolean = true;

  /** Informa se o counter de registros deve aparecer ou não.
   * @default true */
  @Input() public showCounter: boolean = true;

  /** Informa se as rows da tabela devem ter o efeito de hover.
   * @default true */
  @Input() public hoverable: boolean = true;

  /** Informa se a table deve permitir scroll lateral.
   * Se for true, todas as colunas terão a largura fixa de 250px, ignorando valores customizados (esta definição pode mudar no futuro).
   * @default false */
  @Input() public scrollable: boolean = false;

  /** Informa se a table deve ser exibida com o estilo anterior à atualização.
   * @default false */
  @Input() public usePreviousStyle: boolean = false;

  /** Mensagem customizada para lista vazia */
  @Input() public emptyListMessage?: string;

  /**
   * DEVE ser utilizada em caso de paginação visível.
   * Informa um ID para a paginação da tabela específica, usada para distinguir tabelas distintas.
   * @example
   * ```html
   * <lib-table paginationID="simpleTableExample"></lib-table>
   * ```
  */
  @Input()
  public get paginationID(): string { return this._paginationID; }
  public set paginationID(value: string) { this._paginationID = value; }

  // Classes visuais e templates
  @Input() divBorderClass: string = "rounded-bottom rounded";
  @Input() tableBorderClass: string = "";
  @Input() templates: Record<string, TemplateRef<any>> = {};

  // Outputs
  /** Evento emitido quando o número de itens por página é alterado. */
  @Output() public itemsPerPageChange: EventEmitter<number> = new EventEmitter<number>();

  /** Evento emitido quando a página é alterada. */
  @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();

  /** Evento emitido quando o checkbox de seleção se alterar. */
  @Output() public selectionChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Caso seja usado um ícone na coluna e a opção ```headers.icon.emitClick``` for true, ao clicar nela emite este evento que leva consigo o nome da coluna em questão. */
  @Output() public iconClick: EventEmitter<string> = new EventEmitter<string>();

  /** Evento emitido quando as colunas são modificadas. */
  @Output() public colunasModificadas: EventEmitter<TableHeaderStructure[]> = new EventEmitter<TableHeaderStructure[]>();

  // Getters/setters públicos
  /** Página atual da tabela. */
  public get page(): number { return this._currentPage; }
  public set page(value: number) { this._currentPage = value; }

  /** Número de itens a serem exibidos por página. */
  public get itemsPerPage(): number { return this._currentItemsPerPage; }
  public set itemsPerPage(value: number) { this._currentItemsPerPage = value; }

  // Cálculos auxiliares
  public get firstItemOfPage(): number {
    return (this.page - 1) * this.itemsPerPage + 1;
  }

  public get lastItemOfPage(): number {
    return Math.min(this.page * this.itemsPerPage, this.list?.length ?? 0);
  }

  public get itemsDisplayText(): string {
    if (this.list && this.list.length === 0) {
      return `Exibindo ${this.list?.length ?? 0} registros`;
    }
    return `Exibindo ${this.counts ? this.firstItemOfPage + "-" + this.lastItemOfPage + " de" : ""} ${this.list?.length ?? 0} registros`;
  }

  // ViewChilds e demais
  @ViewChild('emptyListTd') emptyListTD?: ElementRef<HTMLTableCellElement>;
  public colspanWidth: string = "";
  // #endregion PUBLIC

  // #endregion ==========> PROPRIEDADES <==========


  // #region ==========> INICIALIZAÇÃO <==========
  constructor(
    private cdr: ChangeDetectorRef,
    private _renderer: Renderer2
  ) { }

  /** Inicializa o componente e define o número inicial de itens por página. */
  ngOnInit(): void {
    this.updateCounterInfo();
    this.validateHeaders();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();  // Forçar uma nova detecção após a renderização
    this.updateColspanWidth();
  }

  /** Monitora as mudanças nas entradas do componente e realiza ajustes, como resetar a paginação ou validar o layout das colunas.
   * @param changes Objeto que contém as mudanças nas entradas do componente. */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list'] && changes['list'].currentValue) {
      this.resetPagination(this.list ?? []);
      this.updateCounterInfo();
      this.updateColspanWidth();
    }
    
    if (changes['headers']) {
      this.validateHeaders();
      this.updateColspanWidth();
    }

    this.updateColspanWidth();
  }
  // #endregion ==========> INICIALIZAÇÃO <==========


  // #region ==========> UTILITÁRIOS <==========

  /** Modifica a quantidade de itens a ser mostrada na lista.
   * @param event parâmetro de evento que irá selecionar a nova quantidade. */
  public onSelectChange(event: any): void {
    this.itemsPerPage = parseInt(event.target.value, 10);
    this.page = 1;
    this.pageChange.emit(this.page);
    this.itemsPerPageChange.emit(this.itemsPerPage);
  }

  /** Reseta a paginação da listagem com base no número atual de registros.
   * @param list Lista de registros para resetar a paginação. */
  public resetPagination(list: unknown[]): void {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    if (list.length <= startIndex) this.page = 1;
  }

  /** Atualiza headers visíveis e emite evento de modificação */
  public updateHeadersVisibility(headers: TableHeaderStructure[]): void {
    this.headers = cloneDeep(headers);
    this.colunasModificadas.emit(cloneDeep(headers));
  }

  /** Emite um evento de correção de página */
  public emitPageBoundsCorrection(page: number): void {
    this.pageChange.emit(page);
  }

  /** Atualiza as informações relacionadas ao contador (usado no footer da tabela, por exemplo) */
  private updateCounterInfo(): void {
    if (this.list && this.showCounter && this.usePagination) {
      this.itemsPerPage = this.counts ? this.counts[0] : this.list.length;
    } else if (!this.list && this.showCounter && this.usePagination) {
      this.itemsPerPage = 1;
    }
  }

  /** Atualiza o colspan para a célula de "lista vazia" e força detecção de mudança */
  private updateColspanWidth(): void {
    if (this.emptyListTD && this.headers) {
      this.colspanWidth = (this.headers.length + (this.useSelection ? 1 : 0)).toString();
      this._renderer.setAttribute(this.emptyListTD.nativeElement, 'colspan', this.colspanWidth);
    }

    this.cdr.detectChanges();
  }

  /** Valida os headers da tabela quanto ao uso correto de classes de largura */
  private validateHeaders(): void {
    const headersUseCol: boolean = this.headers.every(header => header.widthClass?.includes('col'));
    const headersUsePercent: boolean = this.headers.every(header => header.widthClass?.includes('w-'));

    if (!headersUseCol && !headersUsePercent) {
      console.warn("Erro <lib-table>: A largura das colunas está em um formato inválido. Certifique-se que todas elas utilizam apenas 'col-' ou 'w-'. Não podem ser misturadas.");
    }
  }

  // #region Ordering, Sorting ou apenas Ordenação

  /** Objeto para armazenar a direção de ordenação de cada coluna */
  public sortDirection: { [key: string]: 'asc' | 'desc' } = {};

  /** Coluna atualmente selecionada para ordenação */
  public currentSortColumn: string = '';

  /** Função chamada quando ocorre uma mudança na ordenação */
  public onSortChange(event: { direction: string, column: string }): void {
    const { direction, column } = event;

    if (this.currentSortColumn === column) {
      // Alterna entre 'asc' e 'desc'
      this.sortDirection[column] = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    } else {
      // Define nova coluna com 'asc'
      this.currentSortColumn = column;
      this.sortDirection = { [column]: 'asc' };
    }

    this.sortData();
  }

  /** Função de ordenação dos dados da tabela */
  private sortData(): void {
    if (!this.list) return;

    const attribute = this.currentSortColumn;

    this.list.sort((a, b) => {
      const propertyA = this.getProperty(a, attribute).toUpperCase();
      const propertyB = this.getProperty(b, attribute).toUpperCase();

      return Utils.alphanumericSort(propertyA, propertyB, this.sortDirection[attribute]);
    });
  }

  /** Compara os valores das propriedades entre dois objetos */
  private compareProperties(a: unknown, b: unknown, attribute: string, direction: string): number {
    const propertyA = this.getProperty(a, attribute).toUpperCase();
    const propertyB = this.getProperty(b, attribute).toUpperCase();

    if (propertyA < propertyB) return direction === 'asc' ? -1 : 1;
    if (propertyA > propertyB) return direction === 'asc' ? 1 : -1;

    return 0;
  }

  /** Obtém o valor de uma propriedade específica de um objeto, com suporte a paths aninhados */
  private getProperty(obj: any, path: string | string[]): string {
    if (typeof path === 'string') path = path.split('.');

    const property = path.reduce((value, property) => value ? value[property] : '', obj);
    return property ? property.toString() : "";
  }

  // #endregion Ordering, Sorting ou apenas Ordenação

  // #endregion ==========> UTILITÁRIOS <==========

}
