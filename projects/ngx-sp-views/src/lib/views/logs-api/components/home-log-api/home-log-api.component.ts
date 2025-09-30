import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { SearchLogApi } from '../../models/search-log-api';


import { LogsApiService } from '../../services/logs-api.service';

import { Logs } from '../../models/logs-api';
import { RetLogsApi } from '../../models/ret-logs-api';

import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfraModule, MessageService, SearchFiltersComponent } from 'ngx-sp-infra';
import { TenantService } from '../../../../services/tenant.service';

@Component({
  selector: 'app-home-log-api',
  templateUrl: './home-log-api.component.html',
  styleUrl: './home-log-api.component.scss',
  imports: [FormsModule, NgIf, TooltipModule, RouterLink, DatePipe, InfraModule, NgxPaginationModule],
  providers: [TenantService]
})
export class HomeLogApiComponent implements OnInit, AfterViewInit {

  public $retLogList: RetLogsApi = new RetLogsApi();
  public $logList: Logs[] = [];

  public searchLogApi: SearchLogApi = new SearchLogApi();
  public dateInicioIni: Date | null = null;
  public dateInicioFin: Date | null = null;
  public dateFinalIni: Date | null = null;
  public dateFinalFin: Date | null = null;
  public isError: boolean = true;
  public isSlow: boolean = false;

  public counterLabel: string = "";
  public counter: number = 0;
  public page: number = 1;
  public itemsPerPage: number = 10;
  public module: "Corporativo" | "ConfigErp";
  public isListLoading = true;
  public headerOrdering: { [key: string]: { isAsc: boolean, orderingId: string, isActive: boolean } } = {
    'Usuário': { isAsc: false, orderingId: 'NomeUsuarioLogado', isActive: false },
    'API': { isAsc: false, orderingId: 'ApiOrigem', isActive: false },
    'Data/Hora ocorrência': { isAsc: false, orderingId: 'DtHora', isActive: false },
    'Data/Hora final ocorrência': { isAsc: false, orderingId: 'DtHoraFim', isActive: false },
    'Método de origem': { isAsc: false, orderingId: 'MetodoOrigem', isActive: false },

  }
  constructor(
    private cdRef: ChangeDetectorRef,
    private _logService: LogsApiService,
    private _tenantService: TenantService,
    private _messageService: MessageService,
    private _router: Router) {
    this.module = window.location.href.includes('Corporativo') ? "Corporativo" : "ConfigErp";

    if (this.module == 'ConfigErp' && (!this._tenantService.tenantId || this._tenantService.tenantId == 0)) {

      this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")

      this._router.navigate(["/home"]);
    }
  }

  @ViewChild(SearchFiltersComponent) componentPesquisa: SearchFiltersComponent = new SearchFiltersComponent;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const estado = localStorage.getItem('estado-log-api');
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

    localStorage.removeItem('estado-log-api');
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
    this.isListLoading = true;
    this.$retLogList = new RetLogsApi();

    this.searchLogApi.TEXTO_PESQUISA = search;
    this.searchLogApi.DATA_INICIAL_INI = this.dateInicioIni;
    this.searchLogApi.DATA_INICIAL_FIN = this.dateInicioFin;
    this.searchLogApi.DATA_FINAL_INI = this.dateFinalIni;
    this.searchLogApi.DATA_FINAL_FIN = this.dateFinalFin;
    this.searchLogApi.IS_ERROR = this.isError;
    this.searchLogApi.IS_SLOW = this.isSlow;
    this.searchLogApi.ROW_OFF_SET = this.page;
    this.searchLogApi.ROW_LIMIT = this.itemsPerPage;

    this._logService.getLogsList(this.searchLogApi).subscribe({
      next: response => {
        this.$retLogList = response;
        this.$logList = response.LogsApi;
        this.counter = response.Count;
        this.isListLoading = false;
        this.GetTableCounter(this.searchLogApi.ROW_LIMIT, response.Count)

      },
      error: error => {
        this.$retLogList = new RetLogsApi();
        this.$retLogList.LogsApi = [];
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
    localStorage.removeItem('estado-log-api')
    // Cálculo para encontrar o valor inicial do index da página atual
    const startIndex = (this.page - 1) * this.itemsPerPage;

    // Condição para resetar o valor da paginação
    if (list.length <= startIndex) {
      this.page = 1;
    }
  }

  public GetTableCounter(rowLimit:number, totalCount:number) {
    const counterInicial = (this.page -1) * this.itemsPerPage;
    const counterFinal = ((this.page -1) * this.itemsPerPage + rowLimit) > totalCount ? totalCount : ((this.page -1) * this.itemsPerPage + rowLimit);
    this.counterLabel = `Exibindo ${counterInicial}-${counterFinal} de ${totalCount} registros`;
  }

  // Função chamada quando ocorre uma mudança na ordenação
  public currentSortColumn: string = '';

  public sortDirection: { [key: string]: string } = {};

  onSortChange(event: string) {
    this.searchLogApi.ORDERBY = this.headerOrdering[event].orderingId;
    for (const key in this.headerOrdering) {
      if (key != event) {
        this.headerOrdering[key].isActive = false;
        this.headerOrdering[key].isAsc = false;
      } else {
        this.headerOrdering[key].isActive = true;
        this.headerOrdering[key].isAsc = !this.headerOrdering[key].isAsc;
      }
    }
    this.searchLogApi.ORDERISASC = this.headerOrdering[event].isAsc;
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
    localStorage.setItem('estado-log-api', JSON.stringify({
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

