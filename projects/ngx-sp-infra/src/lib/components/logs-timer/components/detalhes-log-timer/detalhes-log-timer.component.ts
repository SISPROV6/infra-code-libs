import { Component, OnInit } from '@angular/core';
import { LogsTimerService } from '../../services/logs-timer.service';
import { Logs } from '../../models/logs-timer';
import { ActivatedRoute, RouterLinkActive, RouterLink, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TenantService } from '../../../../service/tenant.service';
import { MessageService } from '../../../../message/message.service';
import { InfraModule } from '../../../../infra.module';

@Component({
  selector: 'app-detalhes-log-timer',
  templateUrl: './detalhes-log-timer.component.html',
  styleUrl: './detalhes-log-timer.component.scss',
  imports: [InfraModule, RouterLinkActive, RouterLink, DatePipe],
  providers: [TenantService]
})
export class DetalhesLogTimerComponent implements OnInit {

  constructor(
    private _logService: LogsTimerService,
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

  private _logID: number = 0;

  public logData: Logs = new Logs();
  public module: "Corporativo" | "ConfigErp";

  private getLog(id: number = 0): void {
    this._logService.getLog(id).subscribe({
      next: response => {
        this.logData = response.LogTimer;
      },
      error: error => { throw new Error(error) }
    });
  }

  private getParmsFromRoute(): void {
    const id: any = this._route.snapshot.paramMap.get('id');
    this._logID = id;
  }

}

