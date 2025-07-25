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

  public formIntegration: FormGroup = new FormGroup({
    Name: new FormControl<string>("", [Validators.required]),
    InfraIntegrationDesc: new FormControl<string>("", [Validators.required]),
  });

  public formIntegrationParameters: FormGroup = new FormGroup({
    Key: new FormControl<string>("", [Validators.required]),
    Value: new FormControl<string>("", [Validators.required]),
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
  }

}
