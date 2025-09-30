import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormUtils, LibComboboxComponent, LibHeaderComponent, MessageService, RecordCombobox } from 'ngx-sp-infra';
import { LibConfigSenhaComponent } from '../../lib-config-senha/lib-config-senha.component';
import { LibIntegracaoLdapComponent } from '../../lib-integracao-ldap/components/lib-integracao-ldap.component';
import { LibIntegracoesExternasComponent } from "../../lib-integracoes-externas/components/lib-integracoes-externas.component";
import { InfraAuthentication } from '../models/InfraAuthentication';
import { RadioOption } from '../models/RadioOption';
import { InfraAuthenticationService } from '../services/infra-authentication.service';
@Component({
  selector: 'lib-lib-authentication-config',
  imports: [NgIf,
            FormsModule,
            ReactiveFormsModule,
            LibIntegracaoLdapComponent,
            LibIntegracoesExternasComponent,
            LibConfigSenhaComponent,
            LibComboboxComponent,
            LibHeaderComponent,
            ],
  templateUrl: './lib-authentication-config.component.html',
  styleUrl: './lib-authentication-config.component.scss'
})
export class LibAuthenticationConfigComponent {

  constructor(
    private _messageService: MessageService,
    private _infraAuthenticationService: InfraAuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
  }

  @Input() tenant_Id!: number;

  ngOnInit(): void {

    if (!this.tenant_Id || this.tenant_Id == 0) {
      this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")
      this._router.navigate(["/home"]);
    }

    this.GetInfraAuthenticationByTenant();
    this.GetInfraIn2FaTypeCombobox();
    this.GetInfraInAuthTypeRadioButtons();
  }

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _infraAuthId = 0;

  // #endregion PRIVATE

  // #region PUBLIC

  public menuGroup: string = "";

  public infraAuthenticationData: InfraAuthentication = new InfraAuthentication();
  public $comboboxInfraIn2FaType: RecordCombobox[] = [];
  public $optionsInfraInAuthType: RadioOption[] = [];

  public errorMessage: string = '';

  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> FORM BUILDER <==========

  public get FormUtils(): typeof FormUtils { return FormUtils }

  // #region ITEM FORM DATA
  public form: FormGroup = new FormGroup({
    InfraInAuthTypeId: new FormControl<number>(1),
    Is_2FaEnabled: new FormControl<boolean>(false),
    InfraIn2FaTypeId: new FormControl<number | null>(null),
  })

  // #endregion FORM DATA

  // #endregion ==========> FORM BUILDER <==========

  // #region ==========> SERVICE METHODS <==========

  // #region GET

  private GetInfraAuthenticationByTenant(): void {
    this._infraAuthenticationService.GetInfraAuthenticationByTenant().subscribe({
      next: response => {
        this.infraAuthenticationData = response.InfraAuthentication;
        this._infraAuthId = response.InfraAuthentication.Id;

        if (this.infraAuthenticationData.Id != 0) {
          this.form.patchValue({
            ...this.form.value,
            ...response.InfraAuthentication
          })
        }
      },
      error: error => {
        this._messageService.showAlertDanger(error)
        console.error(error)
        this.infraAuthenticationData = new InfraAuthentication();
      }

    });
  }

  public GetInfraIn2FaTypeCombobox() {
    this._infraAuthenticationService.GetInfraIn2FaTypeCombobox().subscribe({
      next: response => {
        this.$comboboxInfraIn2FaType = response.Records;
      }, error: error => {
        this._messageService.showAlertDanger(error);
      }
    })
  }

  public GetInfraInAuthTypeRadioButtons() {

    this._infraAuthenticationService.GetInfraInAuthTypeRadioButtons().subscribe({
      next: response => {
        this.$optionsInfraInAuthType = response.RadioOptions;
      }, error: error => {
        this._messageService.showAlertDanger(error);
        this.$optionsInfraInAuthType = [];
      }
    })
  }

  // #endregion GET
  // #region POST

  public CreateOrUpdateAuthentication(): void {

    if (this.form.valid && this.is2FaInputValid()) {
      this.infraAuthenticationData = this.form.getRawValue() as InfraAuthentication;

      this.infraAuthenticationData.Tenant_Id = this.tenant_Id;
      this.infraAuthenticationData.Id = this._infraAuthId;

      this._infraAuthenticationService.CreateOrUpdateAuthentication(this.infraAuthenticationData).subscribe({
        next: () => {
          this._messageService.showAlertSuccess('As configurações foram aplicadas com sucesso.');
          this.GetInfraAuthenticationByTenant();
        },
        error: error => {
          this._messageService.showAlertDanger(error);
          console.log(error);
        }
      });
    }
    else { FormUtils.validateFields(this.form) }
  }

  // #endregion POST
  // #endregion ==========> SERVICE METHODS <==========

  public is2FaInputValid() {

    if (this.form.get('IS_2FAENABLED')?.value && (this.form.get('InfraIn2FaTypeId')?.value == null || this.form.get('InfraIn2FaTypeId')?.value == 0)) {
      this.errorMessage = "É necessário selecionar o tipo de autenticação"
      this.form.get('InfraIn2FaTypeId')!.setErrors({ invalid: 'É necessário selecionar o tipo de autenticação' })
      this.form.get('InfraIn2FaTypeId')!.markAsTouched();
      return false;
    } else {
      this.errorMessage = '';
      this.form.get('InfraIn2FaTypeId')!.setErrors(null)
      return true;
    }
  }

  public onChange2Fa($event: Event) {
    if (!$event) {
      this.form.get('InfraIn2FaTypeId')?.setValue(null)
    }
  }

  public returnToHome() {
    this._router.navigate(["/home"]);
  }

}
