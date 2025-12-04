import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfraModule, MessageService, SearchFiltersComponent } from 'ngx-sp-infra';

import { TenantService } from '../../../../services/tenant.service';
import { Logs } from '../../models/logs-geral';
import { RetLogsGeral } from '../../models/ret-logs-geral';
import { SearchLogGeral } from '../../models/search-log-geral';
import { LogsGeralService } from '../../services/logs-geral.service';

@Component({
	selector: 'app-logs-geral',
	templateUrl: './home-logs-geral.component.html',
	styleUrls: ['./home-logs-geral.component.scss'],
	imports: [InfraModule, FormsModule, NgIf, TooltipModule, RouterLink, NgxPaginationModule, DatePipe],
  providers: [TenantService]
})
export class LogsGeralComponent implements OnInit {

	public $retLogList: RetLogsGeral = new RetLogsGeral();
	public $logList: Logs[] = [];

	public searchLogGeral: SearchLogGeral = new SearchLogGeral();
	public dateIni: Date | null = null;
	public dateFin: Date | null = null;

	public counter: number = 0;
	public page: number = 1;
	public itemsPerPage: number = 10;
	public module: "Corporativo" | "ConfigErp";
  public isListLoading:boolean = true;
  public counterLabel:string = "";
public headerOrdering: { [key: string]: { isAsc: boolean, orderingId: string, isActive: boolean } } = {
    'Usuário': { isAsc: false, orderingId: 'NomeUsuarioLogado', isActive: false },
    'Data/Hora ocorrência': { isAsc: false, orderingId: 'DtHora', isActive: false },
    'Método de origem': { isAsc: false, orderingId: 'MetodoOrigem', isActive: false },

  }

constructor(
		private cdRef: ChangeDetectorRef,
		private _logService: LogsGeralService,
		private _tenantService: TenantService,
		private _messageService:MessageService,
		private _router: Router) {
		this.module = window.location.href.includes('Corporativo') ? "Corporativo" : "ConfigErp";
		if (this.module == 'ConfigErp' && (!this._tenantService.tenantId || this._tenantService.tenantId == 0)) {

			this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")

			this._router.navigate(["/home"]);
		}
	}

	@ViewChild(SearchFiltersComponent) componentPesquisa?: SearchFiltersComponent;

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		const estado = localStorage.getItem('estado-log-geral');
		if (estado) {
			const dados = JSON.parse(estado);

			if (this.componentPesquisa) this.componentPesquisa.search = dados.textoPesquisa;

			this.page = dados.page;
			this.itemsPerPage = dados.itemsPerPage;
			this.dateIni = dados.dateIni
			this.dateFin = dados.dateFin
		}

		this.getLogsList(this.componentPesquisa?.search);

		this.cdRef.detectChanges();

		localStorage.removeItem('estado-log-geral');
	}

	ngOnDestroy() {
		this.setEstado()
	}


	@HostListener("window:beforeunload", ["$event"])
	setEstadoReload(): void {
		this.setEstado()
	}

	// #region GetList

	public getLogsList(search: string = ''): void {
		this.$retLogList = new RetLogsGeral();

		this.searchLogGeral.TEXTO_PESQUISA = search;
		this.searchLogGeral.DATA_INI = this.dateIni;
		this.searchLogGeral.DATA_FIN = this.dateFin;
		this.searchLogGeral.ROW_LIMIT = this.itemsPerPage;
		this.searchLogGeral.ROW_OFF_SET = this.page;

		this._logService.getLogsList(this.searchLogGeral).subscribe({
			next: response => {
				this.$retLogList = response;
				this.$logList = response.LogsGeral;
				this.counter = response.Count;
        this.isListLoading = false;
        this.GetTableCounter(this.searchLogGeral.ROW_LIMIT, response.Count)
			},
			error: error => {
				this.$retLogList = new RetLogsGeral();
        this.isListLoading = false;
        throw new Error(error);
			}
		});
	}

	// #endregion GetList

	// #region ==========> UTILITIES <==========

	/** Modifica a quantidade de itens a ser mostrada na lista.
	 * @param event parâmetro de evento que irá selecionar a nova quantidade.
	 */
	public onSelectChange(event: any) {
		this.itemsPerPage = parseInt(event.target.value, 10);
		this.page = 1;
		this.getLogsList();
	}

	pageChanged(event: number) {
		this.page = event;
		this.getLogsList();
	}

	/** Reseta a paginação da listagem. */
	public resetPagination(list: any[]): void {
		localStorage.removeItem('estado-log-geral')
		// Cálculo para encontrar o valor inicial do index da página atual
		const startIndex = (this.page - 1) * this.itemsPerPage;

		// Condição para resetar o valor da paginação
		if (list.length <= startIndex) {
			this.page = 1;
		}
	}

	// Função chamada quando ocorre uma mudança na ordenação
	public currentSortColumn: string = '';

	public sortDirection: { [key: string]: string } = {};

onSortChange(event: string) {
    this.searchLogGeral.ORDERBY = this.headerOrdering[event].orderingId;
    for (const key in this.headerOrdering) {
      if (key != event) {
        this.headerOrdering[key].isActive = false;
        this.headerOrdering[key].isAsc = false;
      } else {
        this.headerOrdering[key].isActive = true;
        this.headerOrdering[key].isAsc = !this.headerOrdering[key].isAsc;
      }
    }
    this.searchLogGeral.ORDERISASC =this.headerOrdering[event].isAsc;
    this.getLogsList();
  }
	// Função de ordenação dos dados da tabela
	private sortData() {
		if (this.$logList) {
			const logList = this.$logList;

			logList.sort((a, b) => {
				const attribute = this.currentSortColumn;
				const direction = this.sortDirection[attribute];

				return this.compareProperties(a, b, attribute, direction);
			});
		}
	}

	// Compara os valores das propriedades entre dois objetos
	private compareProperties(a: any, b: any, attribute: string, direction: string): number {
		const propertyA = this.getProperty(a, attribute);
		const propertyB = this.getProperty(b, attribute);

		if (propertyA < propertyB) { return direction === 'asc' ? -1 : 1 }
		if (propertyA > propertyB) { return direction === 'asc' ? 1 : -1 }

		return 0;
	}

	// Obtém o valor de uma propriedade específica de um objeto
	private getProperty(obj: any, path: string | string[]): string {
		if (typeof path === 'string') { path = path.split('.') }
		return path.reduce((value, property) => value ? value[property] : '', obj);
	}

	public setEstado(): void {
		localStorage.setItem('estado-log-geral', JSON.stringify({
			page: this.page,
			itemsPerPage: this.itemsPerPage,
			textoPesquisa: this.componentPesquisa?.search,
			dateIni: this.dateIni,
			dateFin: this.dateFin,
		}));
	}

  public GetTableCounter(rowLimit:number, totalCount:number) {
    const counterInicial = (this.page -1) * this.itemsPerPage;
    const counterFinal = ((this.page -1) * this.itemsPerPage + rowLimit) > totalCount ? totalCount : ((this.page -1) * this.itemsPerPage + rowLimit);
    this.counterLabel = `Exibindo ${counterInicial}-${counterFinal} de ${totalCount} registros`;
  }
	// #endregion ==========> UTILITIES <==========

}
