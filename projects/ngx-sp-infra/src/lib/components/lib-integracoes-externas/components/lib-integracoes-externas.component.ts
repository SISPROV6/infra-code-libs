import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';


import { FormUtils } from '../../../utils/form-utils';
import { MessageService } from '../../../message/message.service';
import { ModalUtilsService } from '../../../service/modal-utils.service';
import { InfraModule } from '../../../infra.module';


import { IntegracoesRecord } from '../models/7Db/IntegracoesRecord';
import { RetIntegracoes } from '../models/2Ws/RetIntegracoes';
import { CadastroIntegracoesExternasService } from '../services/cadastro-integracoes-externas.service';
import { RetIntegracoesParameters } from '../models/2Ws/RetIntegracoesParameters';
import { IntegracoesParameterRecord } from '../models/7Db/InfraIntegrationParameterRecord';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RetIntegracaoParameter } from '../models/2Ws/RetIntegracaoParameter';

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

  @Input() tenant_Id!: number;

  private recordIntegration: IntegracoesRecord = new IntegracoesRecord();
  private recordIntegrationParameters: IntegracoesParameterRecord = new IntegracoesParameterRecord();
  private integrationParameterList: IntegracoesParameterRecord[] = [];

  public IntegracaoId: number = 0;

  public formIntegration: FormGroup = new FormGroup({
    Name: new FormControl<string>("", [Validators.required]),
    InfraIntegrationDesc: new FormControl<string>("", [Validators.required]),
  });

  public formIntegrationParameters: FormGroup = new FormGroup({
    KeyClientId: new FormControl<string>("client_id", [Validators.required]),
    ValueClientId: new FormControl<string>("", [Validators.required]),
    KeyTenantId: new FormControl<string>("tenant_Id", [Validators.required]),
    ValueTenantId: new FormControl<string>("", [Validators.required]),
  });

  public get FormUtils(): typeof FormUtils { return FormUtils; }

  constructor(
    private _integracaoService: CadastroIntegracoesExternasService,
    private _modalService: BsModalService,
    private _messageService: MessageService,
    public modalUtils: ModalUtilsService,
    private _router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    if (!this.tenant_Id || this.tenant_Id == 0) {
      this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")
      this._router.navigate(["/home"]);
    }

    this.formIntegrationParameters.get('KeyClientId')?.disable();
    this.formIntegrationParameters.get('KeyTenantId')?.disable();
  }

  // public getInfraIntegracaoParameter(id: number, Tenant_Id: number): void {
  //   this._integracaoService.GetInfraIntegrationParameter(id, Tenant_Id).subscribe({
  //     next: (response) => {

  //       this.key = response.IntegrationParameter.Key;
  //       this.value = response.IntegrationParameter.Value;
  //       this.IntegracaoParameterId = response.IntegrationParameter.InfraIntegrationParameterId;
  //     },
  //     error: (error) => {
  //       this._projectUtilservice.showHttpError(error);
  //       this.$retIntegracaoParameter = new RetIntegracaoParameter();
  //     },

  //   });
  // }

  public CreateIntegracao() {

    this._integracaoService.CreateInfraIntegration(this.recordIntegration).subscribe({
      next: response => {
        this._messageService.showAlertSuccess('Integração cadastrada com sucesso.');
      },
      error: error => {
        this._messageService.showAlertDanger(error);
      }
    })
    
  }

  public UpdateIntegracao() {

    this._integracaoService.CreateInfraIntegrationParameter(this.integrationParameterList, this.IntegracaoId, this.tenant_Id).subscribe({
      next: response => {
        this._messageService.showAlertSuccess(response.Integration);
      },
      error: error => {
        this._messageService.showAlertDanger(error);
      }
    })
  }

  public GetIntegracao() {

    this._integracaoService.GetInfraIntegracao(this.IntegracaoId, this.tenant_Id).subscribe({
      next: response => {

        this.formIntegration.patchValue({
          ...this.formIntegration.value,
          ...response.Integration,
        });

      },
      error: error => {
        this._messageService.showAlertDanger(error);
      }
    })
  }

  public CreateIntegracaoParameter() {

    this._integracaoService.CreateInfraIntegrationParameter(this.integrationParameterList, this.IntegracaoId, this.tenant_Id).subscribe({
      next: response => {
        this._messageService.showAlertSuccess(response.Integration);
      },
      error: error => {
        this._messageService.showAlertDanger(error);
      }
    })
  }

  public UpdateIntegracaoParameter() {

    this._integracaoService.CreateInfraIntegrationParameter(this.integrationParameterList, this.IntegracaoId, this.tenant_Id).subscribe({
      next: response => {
        this._messageService.showAlertSuccess(response.Integration);
      },
      error: error => {
        this._messageService.showAlertDanger(error);
      }
    })
  }

}
