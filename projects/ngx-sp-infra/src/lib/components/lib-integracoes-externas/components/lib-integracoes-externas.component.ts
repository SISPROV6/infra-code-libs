import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { IntegracoesRecord } from '../models/7Db/IntegracoesRecord';
import { RetIntegracoes } from '../models/2Ws/RetIntegracoes';
import { CadastroIntegracoesExternasService } from '../services/cadastro-integracoes-externas.service';
import { RetIntegracoesParameters } from '../models/2Ws/RetIntegracoesParameters';
import { IntegracoesParameterRecord } from '../models/7Db/InfraIntegrationParameterRecord';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RetIntegracaoParameter } from '../models/2Ws/RetIntegracaoParameter';

import { ModalUtilsService } from '../../../service/modal-utils.service';
import { FormUtils } from '../../../utils/form-utils';
import { MessageService } from '../../../message/message.service';
import { InfraModule } from '../../../infra.module';

@Component({
  selector: 'lib-lib-integracoes-externas',
  imports: [
    ReactiveFormsModule,
    InfraModule,
    FormsModule,
    TooltipModule,
    NgxPaginationModule,
  ],
  templateUrl: './lib-integracoes-externas.component.html',
  styleUrl: './lib-integracoes-externas.component.scss'
})
export class LibIntegracoesExternasComponent {

  @Input() tenant_Id!: number;

  public $retIntegracaoList: RetIntegracoes = new RetIntegracoes();
  public $IntegracaoList: IntegracoesRecord[] = [];

  public $IntegracaoRecord: IntegracoesRecord = new IntegracoesRecord;

  public $retIntegracaoParameterList: RetIntegracoesParameters = new RetIntegracoesParameters();
  public $IntegracaoParameterList: IntegracoesParameterRecord[] = [];

  public $retIntegracaoParameter: RetIntegracaoParameter = new RetIntegracaoParameter();
  public $IntegracaoParameter: IntegracoesParameterRecord = new IntegracoesParameterRecord;

  public counter: number = 0;
  public page: number = 1;
  public itemsPerPage: number = 10;

  public NewIntegrationParameterList: IntegracoesParameterRecord[] = [];
  public Newparameter: IntegracoesParameterRecord = new IntegracoesParameterRecord();

  public IntegracaoId: number = 0;
  public Tenant_Id: number = 0;

  public key: string = "";
  public value: string = "";
  public IntegracaoParameterId: number = 0;

  public Description: string = "";
  public Id: number = 0;

  public Name: string = "";

  public verifyIntegrationExistnce: number = 0;

  InfraIntegracaoParameterForm: FormGroup;

  constructor(
    private _integracaoService: CadastroIntegracoesExternasService,
    private _modalService: BsModalService,
    private _messageService: MessageService,
    public modalUtils: ModalUtilsService,
    private fb: FormBuilder,
    public _router: Router,
  ) {
    this.InfraIntegracaoParameterForm = this.fb.group({
      parameters: this.fb.array([this.createParameterGroup()])
    });
  }

  ngOnInit(): void {
    if (!this.tenant_Id || this.tenant_Id == 0) {
      this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")
      this._router.navigate(["/home"]);
    }
    //this.getCreatedInfraIntegracao();
  }

  public form!: FormGroup;

  public get FormUtils(): typeof FormUtils {
    return FormUtils;
  }

  public InfraIntegracaoForm: FormGroup = new FormGroup({
    Name: new FormControl<string>("", [Validators.required]),
    InfraIntegrationDesc: new FormControl<string>("", [Validators.required]),
  });


  public createParameterGroup(): FormGroup {
    return this.fb.group({
      Key: new FormControl<string>("", [Validators.required]),
      Value: new FormControl<string>("", [Validators.required]),
    });
  }

  // #region ==========> UTILITIES <==========

  // #endregion ==========> UTILITIES <==========
}
