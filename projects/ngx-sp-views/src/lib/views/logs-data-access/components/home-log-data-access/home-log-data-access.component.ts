import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { SearchLogDataAccess } from '../../models/search-log-data-access';


import { LogsDataAccessService } from '../../services/logs-data-access.service';

import { Logs } from '../../models/logs-data-access';
import { RetLogsDataAccess } from '../../models/ret-logs-data-access';

import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfraModule, MessageService, SearchFiltersComponent } from 'ngx-sp-infra';
import { TenantService } from '../../../../services/tenant.service';

@Component({
  selector: 'app-home-log-data-access',
  templateUrl: './home-log-data-access.component.html',
  styleUrl: './home-log-data-access.component.scss',
  imports: [InfraModule, FormsModule, NgIf, TooltipModule, RouterLink, NgxPaginationModule, DatePipe],
  providers: [TenantService]
})
export class HomeLogDataAccessComponent implements OnInit {

  public $retLogList: RetLogsDataAccess = new RetLogsDataAccess();
  public $logList: Logs[] = [];

  public SearchLogDataAccess: SearchLogDataAccess = new SearchLogDataAccess();
  public dateIni: Date | null = null;
  public dateFin: Date | null = null;
  public isError: boolean = true;
  public isSlow: boolean = false;

  public counter: number = 0;
  public page: number = 1;
  public itemsPerPage: number = 10;
  public module: "Corporativo" | "ConfigErp";
  public isListLoading: boolean = true;
  public headerOrdering: { [key: string]: { isAsc: boolean, orderingId: string, isActive: boolean } } = {
    'Usuário': { isAsc: false, orderingId: 'NomeUsuarioLogado', isActive: false },
    'Data/Hora ocorrência': { isAsc: false, orderingId: 'DtHora', isActive: false },
    'Método de origem': { isAsc: false, orderingId: 'MetodoOrigem', isActive: false },
  }
  public counterLabel: string = "";

  constructor(
    private cdRef: ChangeDetectorRef,
    private _logService: LogsDataAccessService,
    private _tenantService: TenantService,
    private _messageService: MessageService,
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
    const estado = localStorage.getItem('estado-log-data-access');
    if (estado) {
      const dados = JSON.parse(estado);

      if (this.componentPesquisa) this.componentPesquisa.search = dados.textoPesquisa;

      this.dateIni = dados.dateIni;
      this.dateFin = dados.dateFin;
      this.isError = dados.isError;
      this.isSlow = dados.isSlow;
      this.page = dados.page;
      this.itemsPerPage = dados.itemsPerPage;
    }

    this.getLogsList(this.componentPesquisa?.search);

    this.cdRef.detectChanges();

    localStorage.removeItem('estado-log-data-access');
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
    this.$retLogList = new RetLogsDataAccess();

    this.SearchLogDataAccess.TEXTO_PESQUISA = search;
    this.SearchLogDataAccess.DATA_INI = this.dateIni;
    this.SearchLogDataAccess.DATA_FIN = this.dateFin;
    this.SearchLogDataAccess.IS_ERROR = this.isError;
    this.SearchLogDataAccess.IS_SLOW = this.isSlow;
    this.SearchLogDataAccess.ROW_LIMIT = this.itemsPerPage;
    this.SearchLogDataAccess.ROW_OFF_SET = this.page;

    this._logService.getLogsList(this.SearchLogDataAccess).subscribe({
      next: response => {
        this.$retLogList = response;
        this.$logList = response.LogsDataAccess;
        this.counter = response.Count;
        console.log(this.itemsPerPage)
        this.isListLoading = false;
                this.GetTableCounter(this.SearchLogDataAccess.ROW_LIMIT, response.Count)

      },
      error: error => {
        this.$retLogList = new RetLogsDataAccess();
        this.$retLogList.LogsDataAccess = [];
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
    localStorage.removeItem('estado-log-data-access')
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
    this.SearchLogDataAccess.ORDERBY = this.headerOrdering[event].orderingId;
    for (const key in this.headerOrdering) {
      if (key != event) {
        this.headerOrdering[key].isActive = false;
        this.headerOrdering[key].isAsc = false;
      } else {
        this.headerOrdering[key].isActive = true;
        this.headerOrdering[key].isAsc = !this.headerOrdering[key].isAsc;
      }
    }
    this.SearchLogDataAccess.ORDERISASC = this.headerOrdering[event].isAsc;
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
    localStorage.setItem('estado-log-data-access', JSON.stringify({
      page: this.page,
      itemsPerPage: this.itemsPerPage,
      dateIni: this.dateIni,
      dateFin: this.dateFin,
      isError: this.isError,
      isSlow: this.isSlow,
      textoPesquisa: this.componentPesquisa?.search
    }));
  }

  public GetTableCounter(rowLimit:number, totalCount:number) {
    const counterInicial = (this.page -1) * this.itemsPerPage;
    const counterFinal = ((this.page -1) * this.itemsPerPage + rowLimit) > totalCount ? totalCount : ((this.page -1) * this.itemsPerPage + rowLimit);
    this.counterLabel = `Exibindo ${counterInicial}-${counterFinal} de ${totalCount} registros`;
  }
  // #endregion ==========> UTILITIES <==========
}
