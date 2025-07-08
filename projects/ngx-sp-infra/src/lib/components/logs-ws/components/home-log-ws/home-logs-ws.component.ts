import { SearchLogWS } from './../../models/search-log-ws';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { LogsWSService } from '../../services/logs-ws.service';
import { RetLogsWS } from '../../models/ret-logs-ws';
import { Logs } from '../../models/logs-ws';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router, RouterLink } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfraModule } from '../../../../infra.module';
import { MessageService } from '../../../../message/message.service';
import { SearchFiltersComponent } from '../../../../../public-api';
import { TenantService } from '../../../../service/tenant.service';

@Component({
	selector: 'app-home-logs-ws',
	templateUrl: './home-logs-ws.component.html',
	styleUrls: ['./home-logs-ws.component.scss'],
	imports: [InfraModule, FormsModule, NgIf, NgFor, TooltipModule, RouterLink, NgxPaginationModule, DatePipe],
  providers: [TenantService]
})
export class HomeLogsWSComponent implements OnInit {

	public $retLogList: RetLogsWS = new RetLogsWS();
	public $logList: Logs[] = [];

	public searchLogWS: SearchLogWS = new SearchLogWS();
	public dateInicioIni: Date | null=null;
	public dateInicioFin: Date | null=null;
	public dateFinalIni: Date | null=null;
	public dateFinalFin: Date | null=null;
	public isError: boolean = true;
	public isSlow: boolean = false;

	public counter: number = 0;
	public page: number = 1;
	public itemsPerPage: number = 10;
	public module: "Corporativo" | "ConfigErp";
  public isListLoading:boolean = true;
	constructor(
		private cdRef: ChangeDetectorRef,
		private _logService: LogsWSService,
		private _tenantService: TenantService,
		private _messageService: MessageService,
		private _router: Router) {
		this.module = window.location.href.includes('Corporativo') ? "Corporativo" : "ConfigErp";
		if (this.module == 'ConfigErp' && (!this._tenantService.tenantId || this._tenantService.tenantId == 0)) {

			this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")

			this._router.navigate(["/home"]);
		}
	}

	@ViewChild(SearchFiltersComponent)
	componentPesquisa: SearchFiltersComponent= new SearchFiltersComponent;

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {

		const estado = localStorage.getItem('estado-log-ws');
		if (estado) {
			const dados = JSON.parse(estado);
			this.componentPesquisa.search = dados.textoPesquisa
			this.dateInicioIni = dados.dateInicioIni
			this.dateInicioFin = dados.dateInicioFin
			this.dateFinalIni = dados.dateFinalIni
			this.dateFinalFin = dados.dateFinalFin
			this.isError = dados.isError;
			this.isSlow = dados.isSlow;
			this.page = dados.page;
			this.itemsPerPage = dados.itemsPerPage;

		}

		this.getLogsList(this.componentPesquisa.search);

		this.cdRef.detectChanges();

		localStorage.removeItem('estado-log-ws');
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
		this.$retLogList = new RetLogsWS();

		this.searchLogWS.TEXTO_PESQUISA = search;
		this.searchLogWS.DATA_INICIAL_INI = this.dateInicioIni;
		this.searchLogWS.DATA_INICIAL_FIN = this.dateInicioFin;
		this.searchLogWS.DATA_FINAL_INI = this.dateFinalIni;
		this.searchLogWS.DATA_FINAL_FIN = this.dateFinalFin;
		this.searchLogWS.IS_ERROR = this.isError;
		this.searchLogWS.IS_SLOW = this.isSlow;
		this.searchLogWS.ROW_LIMIT = this.itemsPerPage;
		this.searchLogWS.ROW_OFF_SET = this.page;

		this._logService.getLogsList(this.searchLogWS).subscribe({
			next: response => {
				this.$retLogList = response;
				this.$logList = response.LogsWS;
				this.counter = response.Count;
        this.isListLoading = false;
			},
			error: error => {
				this.$retLogList = new RetLogsWS();
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
		localStorage.removeItem('estado-log-ws');
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
		localStorage.setItem('estado-log-ws', JSON.stringify({
			page: this.page,
			itemsPerPage: this.itemsPerPage,
			dateInicioIni: this.dateInicioIni,
			dateInicioFin: this.dateInicioFin,
			dateFinalIni: this.dateFinalIni,
			dateFinalFin: this.dateFinalFin,
			isError: this.isError,
			isSlow: this.isSlow,
			textoPesquisa: this.componentPesquisa.search
		}));
	}

	// #endregion ==========> UTILITIES <==========

}
