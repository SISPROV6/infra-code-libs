import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormUtils, InfraModule, MessageService, ModalUtilsService } from 'ngx-sp-infra';
import { ToastrService } from 'ngx-toastr';
import { AuthStorageService } from 'ngx-sp-auth';
import { ProjectUtilservice } from '../../../../../../../ngx-sp-auth/src/lib/project/project-utils.service';
import { InfraEmailCfgRecord } from '../../models/InfraEmailCfgRecord';
import { ConfiguracoesSmtpService } from '../../service/configuracoes-smtp.service.ts.service';
import { EmailConfigTestModel } from '../../models/EmailConfigTestModel';

@Component({
  selector: 'lib-config-email',
  templateUrl: './config-email.component.html',
  styleUrl: './config-email.component.scss',
  imports: [FormsModule, ReactiveFormsModule, InfraModule, TooltipModule]
})
export class ConfigEmailComponent {

  constructor(
    private _configuracoesSmtpService: ConfiguracoesSmtpService,
    private _messageService: MessageService,
    private _projectUtilservice: ProjectUtilservice,
    private _router: Router,
    private _route: ActivatedRoute,
    private _toastrService: ToastrService,
    private _authStorageService: AuthStorageService,
    public modalUtils: ModalUtilsService
  ) { }

  ngOnInit(): void {
    if (this.module == 'Corporativo')
    {
      this.getParmsFromRoute();
      if(!this.isInfraStab)
      {
        this.getInfraEmail();
      }
    }
    else
    {
      this.getInfraEmail();
    }
  }

  // #region ==========> PROPERTIES <==========
  @Input() module: 'ConfigErp' | 'Corporativo' = 'Corporativo'

  @Input() isInfraStab: boolean = false;

  @Output() emitIsEditingMode = new EventEmitter<boolean>();

  @ViewChild('modalTestarConfig') modal!: TemplateRef<any>;

  // #region PRIVATE

  private _infraEstabelecimentoID: string = '';
  private _infraEmailId: number = 0;

  // #endregion PRIVATE

  // #region PUBLIC

  public editingMode: boolean = false;
  public emailData: InfraEmailCfgRecord = new InfraEmailCfgRecord();
  public isPasswordVisible: boolean = false;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> FORM BUILDER <==========

  public get FormUtils(): typeof FormUtils { return FormUtils }

  // #region FORM DATA
  public form: FormGroup = new FormGroup({
    SmtpServer: new FormControl<string>("", [Validators.required, Validators.maxLength(50)]),
    SmtpPort: new FormControl<number>(0, [Validators.maxLength(4)]),
    TimeOut: new FormControl<number>(0, [Validators.maxLength(4)]),
    Username: new FormControl<string>("", [Validators.maxLength(60)]),
    NomeRemet: new FormControl<string>("", [Validators.maxLength(50)]),
    EmailAdress: new FormControl<string>("", [Validators.maxLength(250), Validators.email, Validators.required]),
    Is_SSL: new FormControl<boolean>(false),
    Is_TLS: new FormControl<boolean>(false),
    Is_Authenticated: new FormControl<boolean>(false),
    UrlServidor: new FormControl<string>(""),
  })

  public senhaForm: FormGroup = new FormGroup({
    Password_Ang: new FormControl<string>("", [Validators.maxLength(1000)]),
  })

  public mailTestForm: FormGroup = new FormGroup({
    DESTINATARIOS: new FormControl<string>("", [Validators.required]),
    CC: new FormControl<string>("",),
  })
  // #endregion FORM DATA


  // #endregion ==========> FORM BUILDER <==========


  // #region ==========> SERVICE METHODS <==========

  // #region GET

  public getInfraEmail(infraEstabId: string = ""): void {
    this._configuracoesSmtpService.GetInfraEmail(this.module,this._authStorageService.tenantId, infraEstabId).subscribe({
      next: response => {
        this.emailData = response.InfraEmailCfg;

        if (response.InfraEmailCfg.Id == 0) {
          this.editingMode = false;
          this.EmitIsEditingMode(false);
          this._toastrService.info(this.isInfraStab ? "Este estabelecimento ainda <strong>não possuí<strong> configurações para envio de e-mail" : "Este domínio ainda <strong>não possuí<strong> configurações para envio de e-mail", "", { enableHtml: true })
        } else {
          this.editingMode = true;
          this.EmitIsEditingMode(true);
          this._infraEmailId = response.InfraEmailCfg.Id
        }

        this.form.patchValue({
          ...this.form.value,
          ...response.InfraEmailCfg
        })

        if (response.InfraEmailCfg.UrlServidor == "") {
          this.getServerURL();
        }

      },
      error: error => { this._projectUtilservice.showHttpError(error); }
    });
  }

  public EmitIsEditingMode(isEditingMode: boolean) {
    this.emitIsEditingMode.emit(isEditingMode);
  }
  // #endregion GET

  // #region POST
  public SalvarCfgEmail(): void {
    if ((this.form.valid && this.editingMode) || (this.form.valid && this.senhaForm.valid && !this.editingMode)) {
      this.emailData = this.form.getRawValue() as InfraEmailCfgRecord;
      this.emailData.Tenant_Id = this._authStorageService.tenantId
      this.emailData.Id = this._infraEmailId;
      if (this.isInfraStab) {
        this.emailData.InfraEstabId = this._infraEstabelecimentoID
      }

      if (!this.editingMode) {
        this.emailData.Password_Ang = this.senhaForm.get('Password_Ang')?.value;
      }

      this._configuracoesSmtpService.SalvarCfgEmail(this.module,this.emailData).subscribe({
        next: () => {
          this._messageService.showAlertSuccess('Configurações de e-mail registradas com sucesso.');
          if(this.isInfraStab)
          {
            this.getInfraEmail(this._infraEstabelecimentoID)
          }
          else
          {
            this.getInfraEmail()
          }
        },
        error: error => { this._projectUtilservice.showHttpError(error) }
      });
    }
    else { FormUtils.validateFields(this.form) }
  }

  public UpdateSenha() {
    if (this.senhaForm.valid) {
      this._configuracoesSmtpService.UpdateSenha(this.module,this.senhaForm.get('Password_Ang')?.value, this._infraEmailId).subscribe({
        next: response => {
          this._messageService.showAlertSuccess("Senha alterada com sucesso.")
          this.modalUtils.closeModal(1);
          this.senhaForm.reset();
          if(this.isInfraStab)
          {
            this.getInfraEmail(this._infraEstabelecimentoID)
          }
          else
          {
            this.getInfraEmail()
          }
        }, error: error => {
          this._projectUtilservice.showHttpError(error)
        }
      })
    }
  }


  EnviarEmail() {
    const destinatarioRawValue: string = this.mailTestForm.get("DESTINATARIOS")?.value;
    const ccsRawValue: string = this.mailTestForm.get("CC")?.value;

    let destinatarios: string[] = destinatarioRawValue.split(';');
    let ccs: string[] = ccsRawValue.split(';');

    let isDestinatariosValid: boolean = this.testEmailIsValid(destinatarios);

    let isCcsValid: boolean = this.mailTestForm.get("CC")?.value != "" ? this.testEmailIsValid(ccs) : true;

    if (isDestinatariosValid && isCcsValid && this.editingMode) {
      let emailList: string = this.normalizeEmailList(destinatarios);
      let ccsList: string = this.normalizeEmailList(ccs);

      let record: EmailConfigTestModel = new EmailConfigTestModel();
      record.domain = this._authStorageService.dominio;
      record.user = this.form.get("NomeRemet")?.value;
      record.to = emailList;
      record.cc = ccsList;
      record.userName = this.form.get("NomeRemet")?.value;
      record.urlDoServidor = this.form.get("UrlServidor")?.value;
      record.code = "";
      if (this.isInfraStab) {
        record.infraEstabId = this._infraEstabelecimentoID;
      }

      this._configuracoesSmtpService.SendEmailConfigTest(this.module,record).subscribe({
        next: response => {
          this._messageService.showAlertSuccess("Enviamos um e-mail para os destinatários escohidos! Verifique a caixa de entrada para garantir que tudo está correto (certifique-se de verificar também o seu lixo eletrônico).");
          this.modalUtils.closeModal(2)
        }, error: error => {
          this._projectUtilservice.showHttpError(error);
        }
      })

    }

  }
  // #endregion POST



  // #endregion ==========> SERVICE METHODS <==========

  // #region ==========> UTILITIES <==========
  getServerURL() {
    let href: string = window.location.href;
    this.form.get('UrlServidor')?.setValue(href.split('/', 3).join('/') + '/');
  }

  onCheck(action: 'Nenhum' | 'SSL' | 'TLS') {
    switch (action) {
      case 'Nenhum':
        this.form.get('Is_SSL')?.setValue(false);
        this.form.get('Is_TLS')?.setValue(false);
        break;
      case 'SSL':
        this.form.get('Is_SSL')?.setValue(true);
        this.form.get('Is_TLS')?.setValue(false);
        break;
      case 'TLS':
        this.form.get('Is_SSL')?.setValue(false);
        this.form.get('Is_TLS')?.setValue(true);
        break
    }
  }

  public normalizeEmailList(destinatarios: string[]): string {
    let emailList: string = "";
    for (let index = 0; index < destinatarios.length; index++) {
      emailList += destinatarios[index].trim() + (index < destinatarios.length - 1 ? ";" : "");
    }


    return emailList;
  }

  public testEmailIsValid(destinatarios: string[]): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    for (let index = 0; index < destinatarios.length; index++) {
      destinatarios[index].trim();
      if (!emailRegex.test(destinatarios[index].trim())) {
        this._toastrService.error("O seguinte e-mail não está no formato correto: " + destinatarios[index]);
        return false;
      }
    }

    return true;
  }

  private getParmsFromRoute(): void {

    const id: any = this._route.snapshot.paramMap.get('id');
    this._infraEstabelecimentoID = id;
  }

  public returnToList() { this._router.navigate(["/estabelecimentos"]) }

  // #endregion ==========> UTILITIES <==========
}

