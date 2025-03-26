/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Utils } from '../../utils/utils';
import { TableHeaderStructure } from './models/header-structure.model';

/**
 * Componente de Tabela Customizável
 *
 * O `TableComponent` é um componente Angular projetado para exibir uma tabela customizável
 * com suporte a paginação. Ele permite a configuração de cabeçalhos de colunas, posicionamento
 * da paginação e opções de itens por página. O componente é flexível, utilizando classes Bootstrap
 * para ajustar o layout das colunas e emitindo eventos para que o componente pai possa reagir a
 * mudanças na página ou no número de itens exibidos.
 *
 * @selector lib-table
*/
@Component({
  selector: 'lib-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {

  // #region ==========> PROPRIEDADES <==========

  // #region PRIVATE
  private _paginationID: string = "libTablePagination";
  private _recordsList: unknown[] | undefined;

  private _currentPage: number = 1;
  private _currentItemsPerPage: number = 0;
  // #endregion PRIVATE

  // #region PUBLIC

  @Input() public selection: boolean | undefined = false;

  /** Determina se haverá uma coluna inicial para seleção de registros na tabela. */
  @Input() public useSelection: boolean = false;

  /** Determina o número de registros selecionados. */
  @Input() public selectedCount?: number;

  /** Determina se a tabela deve usar paginação.
   * @default true */
  @Input() public usePagination: boolean = true;
  
  /** Lista de registros a serem exibidos na tabela.
   * @required */
  @Input({ required: true })
  public get list(): unknown[] | undefined { return this._recordsList; }
  public set list(value: unknown[] | undefined) { this._recordsList = value; }

  /** Opções de contagem de itens por página disponíveis para o usuário.
   * @required */
  @Input() public counts?: number[];

  /** Posicionamento dos controles de paginação.
   * @default 'end' */
  @Input() public placement: 'start' | 'center' | 'end' | 'between' = 'end';

  /** Lista de cabeçalhos para as colunas da tabela, incluindo o nome, a largura da coluna e classes customizadas.
   * @see TableHeaderStructure
  */
  @Input({ required: true }) public headers!: TableHeaderStructure[];

  /** Mensagem customizada para lista vazia */
  @Input() public emptyListMessage?: string;

  /** Informa se o counter de registros deve aparecer ou não.
   * @default true */
  @Input() public showCounter: boolean = true;

  /** Informa se as rows da tabela devem ter o efeito de hover.
   * @default true */
  @Input() public hoverable: boolean = true;

  /**
   * DEVE ser utilizada em caso de paginação visível.
   * 
   * Informa um ID para a paginação da tabela específica, usada para distinguir tabelas distintas.
   * 
   * Não está como required pois caso a paginação não seja visível não deve ser obrigatório.
   * 
   * Por obrigatoriedade neste contexto refiro-me ao usar o seletor no seu HTML
   * 
   * @example
   * ```html
   * <lib-table paginationID="simpleTableExample"></lib-table>
   * ```
  */
  @Input()
  public get paginationID(): string { return this._paginationID; }
  public set paginationID(value: string) { this._paginationID = value; }


  /** Evento emitido quando o número de itens por página é alterado. */
  @Output() public itemsPerPageChange: EventEmitter<number> = new EventEmitter<number>();

  /** Evento emitido quando a página é alterada. */
  @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();

  /** Evento emitido quando o checkbox de seleção se alterar. */
  @Output() public selectionChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Caso seja usado um ícone na coluna e a opção ```headers.icon.emitClick``` for true, ao clicar nela emite este evento que leva consigo o nome da coluna em questão. */
  @Output() public iconClick: EventEmitter<string> = new EventEmitter<string>();


  /** Página atual da tabela. */
	public get page(): number { return this._currentPage; }
	public set page(value: number) { this._currentPage = value; }

  /** Número de itens a serem exibidos por página. */
  public get itemsPerPage(): number { return this._currentItemsPerPage; }
	public set itemsPerPage(value: number) { this._currentItemsPerPage = value; }


  public get firstItemOfPage(): number {
    return (this.page - 1) * this.itemsPerPage + 1;
  }
  public get lastItemOfPage(): number {
    return Math.min(this.page * this.itemsPerPage, this.list?.length ?? 0);
  }

  public get itemsDisplayText(): string {
    if (this.list && this.list.length === 0) { return `Exibindo ${this.list?.length ?? 0} registros`; }
    return `Exibindo ${ this.counts ? this.firstItemOfPage+"-"+this.lastItemOfPage + " de" : "" } ${this.list?.length ?? 0} registros`;
  }

  
  public headersUseOldWidth?: boolean;

  // Usadas para controlar as classes de borda dos elementos .table-list e <table>
  @Input() divBorderClass: string = "rounded-bottom rounded";
  @Input() tableBorderClass: string = "";
  

  @ViewChild('emptyListTd') emptyListTD?: ElementRef<HTMLTableCellElement>;

  // public colspanWidth: string = (this.headers ? this.headers.length + (this.useSelection ? 1 : 0) : 12).toString();
  // #endregion PUBLIC

  // #endregion ==========> PROPRIEDADES <==========


  // #region ==========> INICIALIZAÇÃO <==========
  constructor(private cdr: ChangeDetectorRef) { }

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
    }

    if (changes['headers']) {
      this.validateHeaders();
      this.updateColspanWidth();
    }
  }
  // #endregion ==========> INICIALIZAÇÃO <==========


  // #region ==========> UTILITÁRIOS <==========
  public emitPageBoundsCorrection(page: number): void {
    this.pageChange.emit(page);
  }


  private validateHeaders(): void {
    const headersUseOldWidth: boolean = this.headers.every(header => header.col && header.col != undefined);
    
    const headersUseCol: boolean = this.headers.every(header => header.widthClass && header.widthClass.includes('col'));
    const headersUsePercent: boolean = this.headers.every(header => header.widthClass && header.widthClass.includes('w-'));

    if (headersUseOldWidth) { this.headersUseOldWidth = true; }
    else {
      this.headersUseOldWidth = false;

      if (!headersUseCol && !headersUsePercent) {
        console.warn("Erro <lib-table>: A largura das colunas está em um formato inválido. Certifique-se que todas elas utilizam apenas 'col-'/'col-[n]' ou 'w-'. Elas não podem ser usadas alternadamente.");
      }
    }
  }

  private updateCounterInfo(): void {
    if (this.list && this.showCounter && this.usePagination) {
      this.itemsPerPage = this.counts ? this.counts[0] : this.list.length;
    }
    else if (!this.list && this.showCounter && this.usePagination) {
      this.itemsPerPage = 1;
    }
  }


  private updateColspanWidth(): void {
    if (this.emptyListTD && this.headers) {
      let colspanWidth = (this.headers ? this.headers.length + (this.useSelection ? 1 : 0) : 12).toString();
      this.emptyListTD.nativeElement.setAttribute('colspan', colspanWidth);
    }
  }


  /** Modifica a quantidade de itens a ser mostrada na lista.
   * @param event parâmetro de evento que irá selecionar a nova quantidade. */
  public onSelectChange(event: any) {
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

	//#region Ordering, Sorting ou apenas Ordenação

	/** Método que faz a ordenação dos contratos na tela de listagem, em cada uma das células do cabeçalho da tabela, onde cada um  
	 *  dos elementos <th> representa uma coluna, de acordo com a lista de contratos que retorna do backend. */
	// Objeto para armazenar a direção de ordenação de cada coluna
	public sortDirection: { [key: string]: 'asc' | 'desc' } = {};

	// Coluna atualmente selecionada para ordenação
	public currentSortColumn: string = '';

	// Função chamada quando ocorre uma mudança na ordenação
	onSortChange(event: { direction: string, column: string }) {
		const { direction, column } = event;

		// Verifica se a coluna atualmente selecionada é a mesma da nova seleção
		if (this.currentSortColumn === column) {
			// Alterna entre 'asc' e 'desc' para a direção de ordenação da coluna
			this.sortDirection[column] = this.sortDirection[column] === 'asc' ? 'asc' : 'desc';
		}
    else {
			// Define a nova coluna e a direção de ordenação como 'asc'
			this.currentSortColumn = column;
			this.sortDirection = { [column]: 'asc' };
		}

		// Realiza a ordenação dos dados da tabela
		this.sortData();
	}

	// Função de ordenação dos dados da tabela
	private sortData() {
		if (this.list) {
			const recordsList = this.list;

      // ERICK: Novo método de ordenação que abrange também números
      const attribute = this.currentSortColumn;
      recordsList.sort((a, b) => {
        const propertyA = this.getProperty(a, attribute).toUpperCase();
        const propertyB = this.getProperty(b, attribute).toUpperCase();

        return Utils.alphanumericSort(propertyA, propertyB, this.sortDirection[attribute])
      });
      
      // LÓGICA DEPRECIADA
			// recordsList.sort((a, b) => {
			// 	const attribute = this.currentSortColumn;
			// 	const direction = this.sortDirection[attribute];
        
			// 	return this.compareProperties(a, b, attribute, direction);
			// });
		}
	}

	// Compara os valores das propriedades entre dois objetos
	private compareProperties(a: unknown, b: unknown, attribute: string, direction: string): number {
		const propertyA = this.getProperty(a, attribute).toUpperCase();
		const propertyB = this.getProperty(b, attribute).toUpperCase();

		if (propertyA < propertyB) return direction === 'asc' ? -1 : 1;
		if (propertyA > propertyB) return direction === 'asc' ? 1 : -1;

		return 0;
	}

	// Obtém o valor de uma propriedade específica de um objeto
	private getProperty(obj: any, path: string | string[]): string {
		if (typeof path === 'string') path = path.split('.');

    const property = path.reduce((value, property) => value ? value[property] : '', obj);
    return property ? property.toString() : "";
    // .toString() adicionado para permitir todos os tipos de dados
	}
	//#endregion Ordering, Sorting ou apenas Ordenação

  // #endregion ==========> UTILITÁRIOS <==========

}
