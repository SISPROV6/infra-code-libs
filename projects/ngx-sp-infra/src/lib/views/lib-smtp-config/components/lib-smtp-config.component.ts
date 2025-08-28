import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { FormUtils, InfraModule, MessageService, ModalUtilsService } from "ngx-sp-infra";
import { TenantService } from "../../../service/tenant.service";
import { InfraEmailCfgRecord } from "../models/InfraEmailCfgRecord";

@Component({
  selector: 'lib-smtp-config',
  imports: [InfraModule, RouterLink, NgIf, FormsModule, ReactiveFormsModule, TooltipModule],
  templateUrl: './lib-smtp-config.component.html',
  styleUrl: './lib-smtp-config.component.scss'
})
export class LibSmtpConfigComponent {

  constructor(
    private _tenantService: TenantService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _messageService: MessageService,
    public modalUtils: ModalUtilsService
  ) {
    this.module = window.location.href.includes('Corporativo') ? "Corporativo" : "ConfigErp";
		if (this.module == 'ConfigErp' && (!this._tenantService.tenantId || this._tenantService.tenantId == 0)) 
    {
			this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")
			this._router.navigate(["/home"]);
		}
  }

  // ngOnInit(): void {
  //   if (this.module == 'Corporativo')
  //   {
  //     this.getParmsFromRoute();
  //     if(!this.isInfraStab)
  //     {
  //       this.getInfraEmail();
  //     }
  //   }
  //   else
  //   {
  //     this._tenantId = this._tenantService.tenantId;
  //     this.getInfraEmail();
  //   }
  // }

  @Input() isInfraStab: boolean = false;

  private _tenantId: number = 0;
  private _infraEstabelecimentoID: string = '';
  private _infraEmailId: number = 0;

  public editingMode: boolean = false;
  public emailData: InfraEmailCfgRecord = new InfraEmailCfgRecord();
  public isPasswordVisible: boolean = false;

  public module: 'ConfigErp' | 'Corporativo';

  public get FormUtils(): typeof FormUtils { return FormUtils }

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
    // ImapServer: new FormControl<string>("", [Validators.maxLength(50)]),
    // ImapPort: new FormControl<number>(0, [Validators.maxLength(4)]),
    UrlServidor: new FormControl<string>(""),
  })

  public senhaForm: FormGroup = new FormGroup({
    Password_Ang: new FormControl<string>("", [Validators.required, Validators.maxLength(1000)]),
  })

  public mailTestForm: FormGroup = new FormGroup({
    DESTINATARIOS: new FormControl<string>("", [Validators.required]),
    CC: new FormControl<string>("", [Validators.required]),
  })

  // public getInfraEmail(): void {
  //   this._configuracaoSMTPService.GetInfraEmail(this._tenantId).subscribe({
  //     next: response => {
  //       this.emailData = response.InfraEmailCfg;

  //       if (response.InfraEmailCfg.Id == 0) {
  //         this.editingMode = false;
  //         this._toastrService.info("Este estabelecimento ainda <strong>não possuí<strong> configurações para envio de e-mail", "", { enableHtml: true })
  //       } else {
  //         this.editingMode = true;
  //         this._infraEmailId = response.InfraEmailCfg.Id
  //       }

  //       this.form.patchValue({
  //         ...this.form.value,
  //         ...response.InfraEmailCfg
  //       })

  //       if (response.InfraEmailCfg.UrlServidor == "") {
  //         this.getServerURL();
  //       }
  //     },
  //     error: error => {
  //       this._messageService.showAlertDanger(error);
  //     }
  //   });
  // }

  private getServerURL() 
  {
    let href:string = window.location.href;
    this.form.get('UrlServidor')?.setValue(href.split('/', 3).join('/')+ '/');
  }

  private getParmsFromRoute(): void 
  {
    const id: any = this._route.snapshot.paramMap.get('id');
    this._infraEstabelecimentoID = id;
  }
}
