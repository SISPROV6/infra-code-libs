import { Component, OnDestroy, OnInit } from '@angular/core';
import { InfraModule, MessageService, Utils } from 'ngx-sp-infra';
import { ChartData, ChartOptions, ChartType, registerables, Chart, TooltipItem } from 'chart.js';
import { interval, startWith, Subject, switchMap, takeUntil, takeWhile } from 'rxjs';
import { NgIf } from '@angular/common';
import { LibMonitoramentoFilaService } from '../../services/lib-monitoramento-fila.service';


@Component({
  selector: 'app-error-chart',
  imports: [InfraModule, NgIf],
  templateUrl: './error-chart.component.html',
  styleUrl: './error-chart.component.scss'
})
export class ErrorChartComponent implements OnInit, OnDestroy {
  constructor(
    private _libMonitoramentoDeFilaService: LibMonitoramentoFilaService,
    private _messageService:MessageService
  ) { }

  ngOnInit(): void {
    interval(10000) // a cada 10 segundos
      .pipe(
        startWith(0), // executa imediatamente
        takeUntil(this.destroy$), // interrompe se destruir o componente
        takeWhile(() => Date.now() - this.startTime < 2 * 60 * 1000), // para após 2 minutos
        switchMap(() => this._libMonitoramentoDeFilaService.GetEstatisticasErrosDiarios())
      )
      .subscribe({
        next: (response) => {
          const labels = response.Data.map(d => `${d.Hora.toString().padStart(2, '0')}h`);
          const valores = response.Data.map(d => d.TotalFalhas);
          this.createLineChartFromErroPorHora(valores, labels);
        },
        error: (err) => this._messageService.showAlertDanger(Utils.getHttpErrorMessage(err)),
        complete: () => this.isDadosAtualizados = true
      });
  }

  ngOnDestroy(): void {
    if (this.lineChartInstance) {
      this.lineChartInstance.destroy();
    }
  }

  public isDadosAtualizados: boolean = false;
  private destroy$ = new Subject<void>();
  public startTime: number = Date.now();
  public dataInicial = new Date();
  public dataFinal = new Date(this.dataInicial.getTime() + 2 * 60 * 1000);
  public horaFormatada = this.dataFinal.toTimeString().slice(0, 5);
  lineChartType: ChartType = 'line';
  public lineChartInstance: Chart | undefined;

  GetEstatisticaDeErros() {
    this._libMonitoramentoDeFilaService.GetEstatisticasErrosDiarios().subscribe({
      next: response => {
        const labels = response.Data.map(d => `${d.Hora.toString().padStart(2, '0')}h`);
        const valores = response.Data.map(d => d.TotalFalhas);
        this.createLineChartFromErroPorHora(valores, labels);
      }
    });
  }

  public createLineChartFromErroPorHora(valores: number[], labels: string[]) {
    Chart.register(...registerables);
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;

    if (this.lineChartInstance) {
      this.lineChartInstance.destroy();
    }

    this.lineChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Falhas por Hora',
            data: valores,
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1,
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Falhas'
            },
            ticks: {
              precision: 0
            }
          },
          x: {
            title: {
              display: true,
              text: 'Hora do Dia'
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem: TooltipItem<'line'>) {
                const value = tooltipItem.raw as number;
                return `Falhas: ${value}`;
              }
            }
          },
          legend: {
            display: true
          }
        }
      }
    });
  }


  // onSelect(data): void {
  //   console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  // }

  // onActivate(data): void {
  //   console.log('Activate', JSON.parse(JSON.stringify(data)));
  // }

  // onDeactivate(data): void {
  //   console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  // }
}
