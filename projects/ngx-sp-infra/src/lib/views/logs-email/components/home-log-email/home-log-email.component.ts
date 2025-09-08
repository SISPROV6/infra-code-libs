import { SearchLogEmail } from '../../models/search-log-email';
import { Component, HostListener, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LogsEmailService } from '../../services/logs-email.service';

import { RetLogsEmail } from '../../models/ret-logs-email';
import { Logs } from '../../models/logs-email';

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
  selector: 'app-home-log-email',
  templateUrl: './home-log-email.component.html',
  styleUrl: './home-log-email.component.scss',
  imports: [InfraModule, FormsModule, NgIf, NgFor, TooltipModule, RouterLink, NgxPaginationModule, DatePipe],
  providers: [TenantService]
})
export class HomeLogEmailComponent implements OnInit {

  public $retLogList: RetLogsEmail = new RetLogsEmail();
  public $logList: Logs[] = [];

  public searchLogEmail: SearchLogEmail = new SearchLogEmail();
  public dateInicioIni: Date | null = null;
  public dateInicioFin: Date | null = null;
  public dateFinalIni: Date | null = null;
  public dateFinalFin: Date | null = null;
  public isError: boolean = true;
  public counterLabel: string = "";
  public counter: number = 0;
  public page: number = 1;
  public itemsPerPage: number = 10;
  public module: "Corporativo" | "ConfigErp";
  public isListLoading: boolean = true;
  public headerOrdering: { [key: string]: { isAsc: boolean, orderingId: string, isActive: boolean } } = {
    'Usuário': { isAsc: false, orderingId: 'NomeUsuarioLogado', isActive: false },
    'Destinatário': { isAsc: false, orderingId: 'Destinatario', isActive: false },
    'Data/Hora ocorrência': { isAsc: false, orderingId: 'DtHora', isActive: false },
    'Data/Hora final ocorrência': { isAsc: false, orderingId: 'DtHoraFim', isActive: false },
    'Módulo': { isAsc: false, orderingId: 'Modulo', isActive: false },
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private _logService: LogsEmailService,
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
  componentPesquisa: SearchFiltersComponent = new SearchFiltersComponent;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const estado = localStorage.getItem('estado-log-email');
    if (estado) {
      const dados = JSON.parse(estado);
      this.componentPesquisa.search = dados.textoPesquisa
      this.dateInicioIni = dados.dateInicioIni
      this.dateInicioFin = dados.dateInicioFin
      this.dateFinalIni = dados.dateFinalIni
      this.dateFinalFin = dados.dateFinalFin
      this.isError = dados.isError;
      this.page = dados.page;
      this.itemsPerPage = dados.itemsPerPage;
    }

    this.getLogsList(this.componentPesquisa.search);

    this.cdRef.detectChanges();

    localStorage.removeItem('estado-log-email');
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
    this.$retLogList = new RetLogsEmail();

    this.searchLogEmail.TEXTO_PESQUISA = search;
    this.searchLogEmail.DATA_INICIAL_INI = this.dateInicioIni;
    this.searchLogEmail.DATA_INICIAL_FIN = this.dateInicioFin;
    this.searchLogEmail.DATA_FINAL_INI = this.dateFinalIni;
    this.searchLogEmail.DATA_FINAL_FIN = this.dateFinalFin;
    this.searchLogEmail.IS_ERROR = this.isError;
    this.searchLogEmail.ROW_LIMIT = this.itemsPerPage;
    this.searchLogEmail.ROW_OFF_SET = this.page;

    this._logService.getLogsList(this.searchLogEmail).subscribe({
      next: response => {
        this.$retLogList = response;
        this.$logList = response.LogsEmail;
        this.counter = response.Count;
        this.isListLoading = false;
        this.GetTableCounter(this.searchLogEmail.ROW_LIMIT, response.Count)

      },
      error: error => {
        this.$retLogList = new RetLogsEmail();
        this.$retLogList.LogsEmail = [];
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
    localStorage.removeItem('estado-log-email')
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
    this.searchLogEmail.ORDERBY = this.headerOrdering[event].orderingId;
    for (const key in this.headerOrdering) {
      if (key != event) {
        this.headerOrdering[key].isActive = false;
        this.headerOrdering[key].isAsc = false;
      } else {
        this.headerOrdering[key].isActive = true;
        this.headerOrdering[key].isAsc = !this.headerOrdering[key].isAsc;
      }
    }
    this.searchLogEmail.ORDERISASC = this.headerOrdering[event].isAsc;
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
    localStorage.setItem('estado-log-email', JSON.stringify({
      page: this.page,
      itemsPerPage: this.itemsPerPage,
      dateInicioIni: this.dateInicioIni,
      dateInicioFin: this.dateInicioFin,
      dateFinalIni: this.dateFinalIni,
      dateFinalFin: this.dateFinalFin,
      isError: this.isError,
      textoPesquisa: this.componentPesquisa.search
    }));
  }

  public GetTableCounter(rowLimit:number, totalCount:number) {
    const counterInicial = (this.page -1) * this.itemsPerPage;
    const counterFinal = ((this.page -1) * this.itemsPerPage + rowLimit) > totalCount ? totalCount : ((this.page -1) * this.itemsPerPage + rowLimit);
    this.counterLabel = `Exibindo ${counterInicial}-${counterFinal} de ${totalCount} registros`;
  }
  // #endregion ==========> UTILITIES <==========

}

