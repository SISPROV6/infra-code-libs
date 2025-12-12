import { Component, OnDestroy, OnInit } from '@angular/core';
import { InfraModule } from 'ngx-sp-infra';
import { ChartData, ChartOptions, ChartType, registerables, Chart, TooltipItem } from 'chart.js';
import { LibMonitoramentoFilaService } from '../../services/lib-monitoramento-fila.service';
@Component({
  selector: 'app-error-semanal-chart',
  imports: [InfraModule],
  templateUrl: './error-semanal-chart.component.html',
  styleUrl: './error-semanal-chart.component.scss'
})
export class ErrorSemanalChartComponent {
  constructor(
    private _libMonitoramentoDeFilaService: LibMonitoramentoFilaService,
  ) { }

  ngOnInit(): void {
    this.GetEstatisticaDeErros()
  }

  ngOnDestroy(): void {
    if (this.lineChartInstance) {
      this.lineChartInstance.destroy();
    }
  }
  lineChartType: ChartType = 'line';
  public lineChartInstance: Chart | undefined;
  GetEstatisticaDeErros() {
    this._libMonitoramentoDeFilaService.GetEstatisticasErrosSemanais().subscribe({
      next: response => {
        const datas = response.Data.map(d => d.Data.toString().split("T")[0].split("-").reverse().join("/"));
        const totalRequests = response.Data.map(d => d.TotalRequests);
        const taxaFalha = response.Data.map(d => d.TaxaFalhaPercentual);

        this.createLineChartFalhas(totalRequests, taxaFalha, datas);
      }
    });
  }

  public createLineChartFalhas(TotalRequests: number[], TaxaFalhaPercentual: number[], Datas: string[]) {
    Chart.register(...registerables);
    const ctx = document.getElementById('lineChart2') as HTMLCanvasElement;

    if (this.lineChartInstance) {
      this.lineChartInstance.destroy();
    }

    this.lineChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Datas,
        datasets: [
          {
            label: 'Total de requisições',
            data: TotalRequests,
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1,
            yAxisID: 'y',
            tension: 0.2,
            fill: true,
          },
          {
            label: 'Taxa de falha (%)',
            data: TaxaFalhaPercentual,
            backgroundColor: 'rgba(220, 53, 69, 0.2)',
            borderColor: 'rgba(220, 53, 69, 1)',
            borderWidth: 1,
            yAxisID: 'y1',
            tension: 0.2,
            fill: true,
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total de requisições'
            }
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            title: {
              display: true,
              text: 'Taxa de falha (%)'
            },
            ticks: {
              callback: value => `${value}%`
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                if (context.dataset.label === 'Taxa de falha (%)') {
                  return `Taxa de falha: ${context.raw}%`;
                } else {
                  return `Total de requisições: ${context.raw}`;
                }
              }
            }
          }
        }
      }
    });
  }

}
