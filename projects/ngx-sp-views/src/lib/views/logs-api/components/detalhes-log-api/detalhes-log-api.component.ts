import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { InfraModule, MessageService } from 'ngx-sp-infra';
import { TenantService } from '../../../../services/tenant.service';
import { Logs } from '../../models/logs-api';
import { LogsApiService } from '../../services/logs-api.service';

@Component({
    selector: 'app-detalhes-log-api',
    templateUrl: './detalhes-log-api.component.html',
    styleUrl: './detalhes-log-api.component.scss',
    imports: [InfraModule, RouterLinkActive, RouterLink, DatePipe],
    providers: [TenantService]
})
export class DetalhesLogApiComponent implements OnInit {

  public module: "Corporativo" | "ConfigErp";

  constructor(
    private _logService: LogsApiService,
    private _route: ActivatedRoute,
    private _tenantService:TenantService,
    private _messageService:MessageService,
    private _router:Router
  ){
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

  private getLog(id: number = 0): void {
    this._logService.getLog(id).subscribe({
      next: response => {
        this.logData = response.LogApi;
      },
      error: error => { throw new Error(error) }
    });
  }

  private getParmsFromRoute(): void {
    const id: any = this._route.snapshot.paramMap.get('id');
    this._logID = id;
  }

}
