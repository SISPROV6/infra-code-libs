import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableHeaderStructure } from '../../models/table/header-structure.model';
import { LibIconsComponent } from "../lib-icons/lib-icons.component";

@Component({
  selector: 'lib-simplified-table',
  imports: [
    FormsModule,
    TooltipModule,
    NgxPaginationModule,
    NgTemplateOutlet,
    LibIconsComponent,
    TooltipModule
  ],
  templateUrl: './lib-simplified-table.component.html',
  styleUrl: './lib-simplified-table.component.scss'
})
export class LibSimplifiedTableComponent implements OnInit, AfterViewInit, OnChanges {

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
  @Input() public counts?: number[] = [ 10, 25, 50 ];

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

  /** Mensagem customizada para lista vazia */
  @Input() public emptyListMessage?: string;

  /** Informa se a lógica e elementos de paginação devem ficar fora do componente e serem gerenciados pelo componente pai.
   * @default false */
  @Input() public useCustomPagination: boolean = false;

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
  @Input() templates: Record<string, TemplateRef<any> | null> = {};
  @Input() upperContentTemplate?: TemplateRef<any>;

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
    if (this.list && this.list.length === 0) return `Exibindo ${this.list?.length ?? 0} registros`;
    
    const totalRecords = this.list?.length ?? 0;
    
    if (this.counts) return `Exibindo ${this.firstItemOfPage}-${this.lastItemOfPage} de ${totalRecords} registros`;
    else return `Exibindo ${totalRecords} registros`;
  }

  // ViewChilds e demais
  @ViewChild('emptyListTd') emptyListTD?: ElementRef<HTMLTableCellElement>;
  public colspanWidth: string = "";
  // #endregion PUBLIC

  // #endregion ==========> PROPRIEDADES <==========


  // #region ==========> INICIALIZAÇÃO <==========
  constructor(
    private readonly _cdr: ChangeDetectorRef,
    private readonly _renderer: Renderer2
  ) { }

  /** Inicializa o componente e define o número inicial de itens por página. */
  ngOnInit(): void {
    this.updateCounterInfo();
    this.validateHeaders();
  }

  ngAfterViewInit(): void {
    this._cdr.detectChanges();  // Forçar uma nova detecção após a renderização
    this.updateColspanWidth();
    this._cdr.detectChanges();  // Forçar uma nova detecção após a renderização
  }

  /** Monitora as mudanças nas entradas do componente e realiza ajustes, como resetar a paginação ou validar o layout das colunas.
   * @param changes Objeto que contém as mudanças nas entradas do componente. */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list']?.currentValue) {
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
  }

  /** Reseta a paginação da listagem com base no número atual de registros.
   * @param list Lista de registros para resetar a paginação. */
  public resetPagination(list: unknown[]): void {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    if (list.length <= startIndex) this.page = 1;
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
      this.colspanWidth = (this.headers.length + 0).toString();
      this._renderer.setAttribute(this.emptyListTD.nativeElement, 'colspan', this.colspanWidth);
    }

    this._cdr.detectChanges();
  }

  /** Valida os headers da tabela quanto ao uso correto de classes de largura */
  private validateHeaders(): void {
    const headersUseCol: boolean = this.headers?.every(header => header.widthClass?.includes('col'));
    const headersUsePercent: boolean = this.headers?.every(header => header.widthClass?.includes('w-'));

    if (!headersUseCol && !headersUsePercent) {
      console.warn("Erro <lib-table>: A largura das colunas está em um formato inválido. Certifique-se que todas elas utilizam 'col'/'col-[n]' ou 'w-[n]'.");
    }
  }

  // #endregion ==========> UTILITÁRIOS <==========

}
