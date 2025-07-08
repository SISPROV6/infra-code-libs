import { Component, OnInit } from '@angular/core';
import { LogsDataAccessService } from '../../services/logs-data-access.service';
import { Logs } from '../../models/logs-data-access';
import { ActivatedRoute, RouterLinkActive, RouterLink, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TenantService } from '../../../../service/tenant.service';
import { MessageService } from '../../../../message/message.service';
import { InfraModule } from '../../../../infra.module';

@Component({
  selector: 'app-detalhes-log-data-access',
  templateUrl: './detalhes-log-data-access.component.html',
  styleUrl: './detalhes-log-data-access.component.scss',
  imports: [InfraModule, RouterLinkActive, RouterLink, DatePipe],
  providers: [TenantService]
})
export class DetalhesLogDataAccessComponent implements OnInit {

  constructor(
    private _logService: LogsDataAccessService,
    private _route: ActivatedRoute,
    private _tenantService:TenantService,
    private _router:Router,
    private _messageService:MessageService
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
        this.logData = response.LogDataAccess;
      },
      error: error => { throw new Error(error) }
    });
  }

  private getParmsFromRoute(): void {
    const id: any = this._route.snapshot.paramMap.get('id');
    this._logID = id;
  }

}

