import { Component, OnInit } from '@angular/core';
import { LogsReportService } from '../../services/logs-report.service';
import { Logs } from '../../models/logs-report';
import { ActivatedRoute, RouterLinkActive, RouterLink, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { InfraModule } from '../../../../infra.module';
import { TenantService } from '../../../../service/tenant.service';
import { MessageService } from '../../../../message/message.service';

@Component({
  selector: 'app-detalhes-logs-report',
  templateUrl: './detalhes-logs-report.component.html',
  styleUrl: './detalhes-logs-report.component.scss',
  imports: [InfraModule, RouterLinkActive, RouterLink, DatePipe],
  providers: [TenantService]
})
export class DetalhesLogsReportComponent implements OnInit {
  constructor(
    private _logService: LogsReportService,
    private _tenantService: TenantService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {
    this.module = window.location.href.includes('Corporativo') ? "Corporativo" : "ConfigErp";
    if (this.module == 'ConfigErp' && (!this._tenantService.tenantId || this._tenantService.tenantId == 0)) {

      this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")

      this._router.navigate(["/home"]);
    }
  }

  ngOnInit(): void {
    this.getParmsFromRoute()
    this.getLog(this._logID)
  }

  private _logID: number = 0;;

  public logData: Logs = new Logs();
  public module: 'ConfigErp' | 'Corporativo'
  private getLog(id: number = 0): void {
    this._logService.getLog(id).subscribe({
      next: response => {
        this.logData = response.LogReport;
      },
      error: error => { throw new Error(error) }
    });
  }

  private getParmsFromRoute(): void {
    const id: any = this._route.snapshot.paramMap.get('id');
    this._logID = id;
  }

}

