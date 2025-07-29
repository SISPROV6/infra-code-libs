import { IntegrationAzureSSOForm } from './../models/3Rn/IntegrationAzureSSOForm';
import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';


import { FormUtils } from '../../../utils/form-utils';
import { MessageService } from '../../../message/message.service';
import { ModalUtilsService } from '../../../service/modal-utils.service';
import { InfraModule } from '../../../infra.module';
import { CadastroIntegracoesExternasService } from '../services/cadastro-integracoes-externas.service';

import { IntegracaoAzureSSORecord } from '../models/3Rn/IntegracaoAzureSSORecord';

@Component({
  selector: 'lib-lib-integracoes-externas',
  imports: [
    ReactiveFormsModule,
    InfraModule,
    FormsModule,
    TooltipModule,
    NgxPaginationModule,
    DatePipe,
  ],
  templateUrl: './lib-integracoes-externas.component.html',
  styleUrl: './lib-integracoes-externas.component.scss'
})
export class LibIntegracoesExternasComponent {

  constructor(
    private _integracaoService: CadastroIntegracoesExternasService,
    private _messageService: MessageService,
    public modalUtils: ModalUtilsService,
    private _router: Router,
  ) { }

  @Input() tenant_Id!: number;

  public recordIntegrationAzureSSO: IntegracaoAzureSSORecord = new IntegracaoAzureSSORecord();
  public integrationAzureSSOForm: IntegrationAzureSSOForm = new IntegrationAzureSSOForm();
  public IntegracaoId: number = 0;

  public formIntegrationParameters: FormGroup = new FormGroup({
    ValueClientId: new FormControl<string>("", [Validators.required]),
    ValueTenantId: new FormControl<string>("", [Validators.required]),
  });

  public get FormUtils(): typeof FormUtils { return FormUtils; }

  ngOnInit() {

    if (!this.tenant_Id || this.tenant_Id == 0) {
      this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")
      this._router.navigate(["/home"]);
    }

    this.formIntegrationParameters.get('KeyClientId')?.disable();
    this.formIntegrationParameters.get('KeyTenantId')?.disable();

    this.GetIntegracao();

  }

  public GetIntegracao() {

    this._integracaoService.GetInfraIntegracaoAzureSSO(this.tenant_Id).subscribe
    ({
      next: response => 
      {

        this.recordIntegrationAzureSSO = response.IntegrationAzureSSO;

        this.IntegracaoId = response.IntegrationAzureSSO.Id;

        const parameters = response.IntegrationAzureSSO.Parameters;

        this.formIntegrationParameters.get('ValueClientId')?.setValue(parameters.find(item => item.Key === "client_id")?.Value ?? "");
        this.formIntegrationParameters.get('ValueTenantId')?.setValue(parameters.find(item => item.Key === "tenant_id")?.Value ?? "");

      },
      error: error => {
        this._messageService.showAlertDanger(error);
      }
    })
  }

  public CreateOrUpdateoIntegrationAzureSSO() {

    if (this.formIntegrationParameters.valid) {

      this.integrationAzureSSOForm = this.formIntegrationParameters.getRawValue()
      this.integrationAzureSSOForm.Integration_Id = this.IntegracaoId;
      this.integrationAzureSSOForm.Name = "SSO Azure";
      this.integrationAzureSSOForm.InfraIntegrationDesc = "SSO Azure";
      this.integrationAzureSSOForm.KeyClientId = "client_id";
      this.integrationAzureSSOForm.KeyTenantId = "tenant_id";
      this.integrationAzureSSOForm.Tenant_Id = this.tenant_Id;
      this.integrationAzureSSOForm.Is_Active = true;

        this._integracaoService.CreateOrUpdateIntegracaoAzureSSO(this.integrationAzureSSOForm).subscribe({
          next: () => {
            this._messageService.showAlertSuccess('Dados da integração Azure Salvos com sucesso.');
          },
          error: error => {
            this._messageService.showAlertDanger(error);
          }
        })
    }
  }

}
