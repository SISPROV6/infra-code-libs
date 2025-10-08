import { CommonModule, DatePipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { GlobalLoadingService, InfraModule, MessageService, ModalUtilsService, RecordCombobox, Utils } from 'ngx-sp-infra';
import { InfraQueueTableRows } from './models/InfraQueueTableRows';
import { Count } from './models/Count';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ErrorChartComponent } from './components/error-chart/error-chart.component';
import { ErrorSemanalChartComponent } from './components/error-semanal-chart/error-semanal-chart.component';
import { interval, startWith, Subject, switchMap, takeUntil, takeWhile } from 'rxjs';
import { LogInfraQueueRecord } from './models/LogInfraQueue';
import { LibMonitoramentoFilaService } from './services/lib-monitoramento-fila.service';
import { InfraQueueRecord } from './models/InfraQueueRecord';

@Component({
  selector: 'lib-monitoramento-fila',
  imports: [InfraModule, NgIf, FormsModule, NgxPaginationModule, ReactiveFormsModule, DatePipe, SlicePipe, TooltipModule, ErrorChartComponent, ErrorSemanalChartComponent, CommonModule],
  templateUrl: './lib-monitoramento-fila.component.html',
  styleUrl: './lib-monitoramento-fila.component.scss'
})
export class LibMonitoramentoFilaComponent implements OnInit, OnDestroy {



  constructor(
    private _messageService: MessageService,
    private _filaMonitoramentoDeFilaService: LibMonitoramentoFilaService,


    public modalUtils: ModalUtilsService
  ) {
  }

  ngOnDestroy(): void {
    this._filaMonitoramentoDeFilaService.setIsGlobalQueue(false);
  }

  ngOnInit(): void {
    this._filaMonitoramentoDeFilaService.setIsGlobalQueue(this.isGlobalQueue)

    this.GetTableOnPoolling();
    this.GetNumeroAgendadosParaHoje();
    this.GetNumeroFalhasHoje();
    this._globalLoadingProperty.show();
  }

  @Input() isGlobalQueue: boolean = false;

  private _globalLoadingProperty: GlobalLoadingService = inject(GlobalLoadingService);

  public isLoadingModal: boolean = false;
  public isLoadingTable: boolean = false;
  public infraQueueTableRows?: InfraQueueTableRows[] = [];
  public page: number = 1;
  public itemsPerPage: number = 5;
  public infraQueueRecord: InfraQueueRecord = new InfraQueueRecord();
  public showParamDetails: boolean = false;
  public logInfraQueueRecord: LogInfraQueueRecord= new LogInfraQueueRecord();

  public agendadosTableRows?: InfraQueueTableRows[] = [];
  public agendadospage: number = 1;
  public agendadositemsPerPage: number = 5;

  public falhasTableRows?: InfraQueueTableRows[] = [];
  public falhaspage: number = 1;
  public falhasitemsPerPage: number = 5;

  public logsTableRows?: LogInfraQueueRecord[] = [];
  public logspage: number = 1;
  public logsitemsPerPage: number = 5;

  public selectedCard: number = 0;
  public isLoadingCard: boolean = false;
  public numeroAgendados = 0;
  public numeroFalhas = 0;

  public countProcessando = 0;
  public countPendente = 0;
  public countConcluido = 0;
  public countFalha = 0;
  public countCancelado = 0;
  public countAbandonado = 0;

  public cardInfo = [
    { title: 'Processando', status: 1, contagem: 0, cardSelected: 'PROCESSANDO', colorClass: 'card-processando' },
    { title: 'Pendente', status: 2, contagem: 0, cardSelected: 'PENDENTE', colorClass: 'card-pendente' },
    { title: 'Concluído', status: 3, contagem: 0, cardSelected: 'CONCLUÍDO', colorClass: 'card-concluido' },
    { title: 'Com falha', status: 4, contagem: 0, cardSelected: 'COM FALHA', colorClass: 'card-falha' },
    { title: 'Cancelado', status: 5, contagem: 0, cardSelected: 'CANCELADO', colorClass: 'card-cancelado' },
    { title: 'Abandonado', status: 6, contagem: 0, cardSelected: 'ABANDONADO', colorClass: 'card-abandonado' },
  ];

  public statusCombobox: RecordCombobox[] = [
    { ID: "PENDENTE", LABEL: "Pendente" },
    { ID: "CONCLUÍDO", LABEL: "Concluído" },
    { ID: "COM FALHA", LABEL: "Com falha" },
    { ID: "CANCELADO", LABEL: "Cancelado" },
    { ID: "PROCESSANDO", LABEL: "Processando" },
    { ID: "ABANDONADO", LABEL: "Abandonado" },
  ]

  public HttpMethodCombobox: RecordCombobox[] = [
    { ID: "POST", LABEL: "POST" },
    { ID: "GET", LABEL: "GET" },
    { ID: "DELETE", LABEL: "DELETE" }
  ]

  public statusClasses: { [key: string]: { classes: string } } = {
    'PENDENTE': { classes: "badge text-bg-secondary" },
    'CONCLUÍDO': { classes: "badge text-bg-success" },
    'COM FALHA': { classes: "badge text-bg-danger" },
    'CANCELADO': { classes: "badge text-bg-danger" },
    'PROCESSANDO': { classes: "badge text-bg-primary" },
    'ABANDONADO': { classes: "badge bg-dark text-white" },
  }

  public LogStatusClasses: { [key: string]: { classes: string } } = {
    'INFO': { classes: "badge text-bg-secondary" },
    'SUCCESS': { classes: "badge text-bg-success" },
    'ERROR': { classes: "badge text-bg-danger" },
    'WARNING': { classes: "badge text-bg-warning" },
  }

  public isDadosAtualizados: boolean = false;
  private destroy$ = new Subject<void>();
  public startTime: number = Date.now();
  public dataInicial = new Date();
  public dataFinal = new Date(this.dataInicial.getTime() + 2 * 60 * 1000);
  public horaFormatada = this.dataFinal.toTimeString().slice(0, 5);

  public form: FormGroup = new FormGroup({
    HttpMethod: new FormControl<string>(""),
    Status: new FormControl<string>(""),
    CreatedDateIni: new FormControl<Date | string>(""),
    CreatedDateFinal: new FormControl<string>(""),
    EndpointSearch: new FormControl<string>(""),
  })

  public getTable(endpointSearch: string) {
    this.form.get('EndpointSearch')?.setValue(endpointSearch);
    this._filaMonitoramentoDeFilaService.GetList(this.form.get("HttpMethod")?.value, this.form.get("Status")?.value, this.form.get("CreatedDateIni")?.value, this.form.get("CreatedDateFinal")?.value, endpointSearch)
      .subscribe({
        next: response => {
          this.infraQueueTableRows = response.Data;
          this.GetCount();
        }, error: error => this._messageService.showAlertDanger(Utils.getHttpErrorMessage(error))
      })
  }

  public GetTableOnPoolling() {
    interval(10000) // a cada 10 segundos
      .pipe(
        startWith(0), // executa imediatamente
        takeUntil(this.destroy$), // interrompe se destruir o componente
        takeWhile(() => Date.now() - this.startTime < 2 * 60 * 1000), // para após 2 minutos
        switchMap(() => this._filaMonitoramentoDeFilaService.GetList(this.form.get("HttpMethod")?.value, this.form.get("Status")?.value, this.form.get("CreatedDateIni")?.value, this.form.get("CreatedDateFinal")?.value, this.form.get('EndpointSearch')?.value))
      )
      .subscribe({
        next: (response) => {
          this.infraQueueTableRows = response.Data;
          this.GetCount();
        },
        error: (err) => {
          this._messageService.showAlertDanger(Utils.getHttpErrorMessage(err));
          this._globalLoadingProperty.hide();
        },
        complete: () => this.isDadosAtualizados = true
      });
  }

  public GetCount() {
    this._filaMonitoramentoDeFilaService.GetCount().subscribe({
      next: response => {
        this.countCards(response.Data)
        this._globalLoadingProperty.hide();
      }, error: error => {
        this._messageService.showAlertDanger(Utils.getHttpErrorMessage(error));
        this._globalLoadingProperty.hide();
      }
    })
  }

  public countCards(itemCount: Count) {
    this.cardInfo.forEach(card => {
      let count = 0;
      switch (card.status) {
        case 1:
          this.countProcessando = itemCount.TotalProcessando;
          break;
        case 2:
          this.countPendente = itemCount.TotalPendente;
          break;
        case 3:
          this.countConcluido = itemCount.TotalConcluido;
          break;
        case 4:
          this.countFalha = itemCount.TotalComFalha;
          break;
        case 5:
          this.countCancelado = itemCount.TotalCancelado;
          break;
        case 6:
          this.countAbandonado = itemCount.TotalAbandonado;
          break;
        default:
          break;
      }
      card.contagem = count;
    });
    console.log(this.cardInfo)

  }

  public toggleCardSelection(status: number): void {
    this.selectedCard == status ? this.selectedCard = 0 : this.selectedCard = status;

    this.filterList()
  }

  public filterList() {
    const selectedCard: string | undefined = this.cardInfo.find(card => card.status == this.selectedCard)?.cardSelected
    this.form.get('Status')?.setValue(selectedCard);
    this.getTable('');

  }

  public GetNumeroAgendadosParaHoje() {
    this._filaMonitoramentoDeFilaService.GetNumeroAgendadosParaHoje().subscribe({
      next: response => this.numeroAgendados = response.Number,
      error: error => this._messageService.showAlertDanger(Utils.getHttpErrorMessage(error))
    })
  }

  public GetNumeroFalhasHoje() {
    this._filaMonitoramentoDeFilaService.GetNumeroFalhasHoje().subscribe({
      next: response => this.numeroFalhas = response.Number,
      error: error => this._messageService.showAlertDanger(Utils.getHttpErrorMessage(error))
    })
  }

  public GetAgendados() {
    this._filaMonitoramentoDeFilaService.GetAgendadosParaHoje().subscribe({
      next: response => {
        this.agendadosTableRows = response.Data;
      }, error: error => {
        this._messageService.showAlertDanger(Utils.getHttpErrorMessage(error));;
      }
    })
  }

  public GetFalhas() {
    this._filaMonitoramentoDeFilaService.GetFalhasHoje().subscribe({
      next: response => {
        this.falhasTableRows = response.Data;
      }, error: error => {
        this._messageService.showAlertDanger(Utils.getHttpErrorMessage(error));;
      }
    })
  }

  onOpenModelAgendados(template: TemplateRef<any>) {
    this.GetAgendados();
    const modalOptions: ModalOptions = {
      id: 1,
      class: 'modal-dialog-centered modal-lg',
      animated: true
    }
    this.modalUtils.openModalCustom(template, 1, modalOptions);
  }

  onOpenModelFalhas(template: TemplateRef<any>) {
    this.GetFalhas();
    const modalOptions: ModalOptions = {
      id: 2,
      class: 'modal-dialog-centered modal-lg',
      animated: true
    }
    this.modalUtils.openModalCustom(template, 2, modalOptions);
  }

  public Dequeue(id: number) {
    this._filaMonitoramentoDeFilaService.Dequeue(id).subscribe({
      next: response => {
        this.modalUtils.closeModal(1);
        this.modalUtils.closeModal(2);
        this.getTable("");
        this._messageService.showAlertSuccess("Tarefa cancelada com sucesso!");
      }
    })
  }


  onOpenLogsModal(modal: TemplateRef<any>) {
    this.GetLogs();
    const modalOptions: ModalOptions = {
      id: 3,
      class: 'modal-dialog-centered modal-lg',
      animated: true
    }
    this.modalUtils.openModalCustom(modal, 3, modalOptions);
  }

  public GetLogs(search: string = "") {
    this._filaMonitoramentoDeFilaService.GetLogsList(search).subscribe({
      next: response => {
        this.logsTableRows = response.Data;
        this.logspage = 1;
      }, error: error => this._messageService.showAlertDanger(Utils.getHttpErrorMessage(error))
    })
  }

  onOpenModalDetails(id: number, template: TemplateRef<any>) {
    this.GetTaskDetais(id);
    const modalOptions: ModalOptions = {
      id: 1,
      class: 'modal-dialog-centered modal-lg',
      animated: true,
      ignoreBackdropClick: true,
      keyboard: false
    }
    this.modalUtils.openModalCustom(template, 1, modalOptions)
  }


  onOpenModalLogs(id: number, template: TemplateRef<any>) {
    this.GetLogByTaskId(id);

    const modalOptions: ModalOptions = {
      id: 1,
      class: 'modal-dialog-centered modal-lg',
      animated: true,
      ignoreBackdropClick: true,
      keyboard: false
    }

    this.modalUtils.openModalCustom(template, 1, modalOptions)

  }

  public get Utils() { return Utils }

  GetTaskDetais(id: number) {
    this.isLoadingModal = true;
    this._filaMonitoramentoDeFilaService.GetQueueTaskById(id).subscribe({
      next: response => {
        this.infraQueueRecord = response.Data,
          this.isLoadingModal = false;
      }, error: error => {
        this.isLoadingModal = false;
        this._messageService.showAlertDanger(Utils.getHttpErrorMessage(error));
      }
    })
  }

  navigateFromModalToDetailsModal(id: number, template: TemplateRef<any>, idModalAtual:number) {
    this.modalUtils.closeModal(idModalAtual);

    setTimeout(() => {

      this.onOpenModalDetails(id, template)
    }, 500);


  }
  navigateFromModalToLogsModal(id: number, template: TemplateRef<any>, idModalAtual:number) {
    this.modalUtils.closeModal(idModalAtual);

    setTimeout(() => {

      this.onOpenModalLogs(id, template)
    }, 500);


  }
  onCloseDetailsModal() {
    this.showParamDetails = false;
    this.modalUtils.closeModal(1)
  }
  onShowBodyParams() {
    this.showParamDetails = true
  }

  GetLogByTaskId(id: number) {
    this.isLoadingModal = true;
    this._filaMonitoramentoDeFilaService.GetLogByTaskId(id).subscribe({
      next: response => {
        this.logInfraQueueRecord = response.Data;
        this.isLoadingModal = false;
      }, error: error => {
        this._messageService.showAlertDanger(Utils.getHttpErrorMessage(error));;
        this.isLoadingModal = false;
      }
    })
  }


}
