import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormUtils } from '../../utils/form-utils';
import { MessageService } from '../../message/message.service';

import { InfraSegConfig } from '../../models/config-senha/7Db/InfraSegConfig.record';
import { ConfiguracaoSenhaService } from '../../service/configuracao-senha.service';
import { TenantService } from '../../service/tenant.service';
import { Title } from '@angular/platform-browser';
import { LibHeaderComponent } from '../../widgets/lib-header/lib-header.component';
import { ContentContainerComponent } from '../../widgets/content-container/content-container.component';
import { NgIf, NgClass } from '@angular/common';
import { LibIconsComponent } from '../../widgets/lib-icons/lib-icons.component';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { RequiredDirective } from '../../directives/required.directive';
import { FieldErrorMessageComponent } from '../../widgets/field-error-message/field-error-message.component';
import { LibSpinnerComponent } from '../../widgets/spinner/spinner.component';

@Component({
    selector: 'lib-config-senha',
    templateUrl: './lib-config-senha.component.html',
    styles: ``,
    standalone: true,
    imports: [LibHeaderComponent, ContentContainerComponent, NgIf, FormsModule, ReactiveFormsModule, NgClass, LibIconsComponent, TooltipDirective, RequiredDirective, FieldErrorMessageComponent, LibSpinnerComponent]
})
export class LibConfigSenhaComponent implements OnInit {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private readonly user_auth_v6 = localStorage["user_auth_v6"] ?? "{}";
  private readonly __tokenPayload = JSON.parse(this.user_auth_v6).__tokenPayload ?? { tenantId: 1579 };

  private _localTenantId = this.__tokenPayload.tenantId ?? 0;
  // #endregion PRIVATE

  // #region PUBLIC
  public menuGroup!: string;
  public $infraSegConfigRecord?: InfraSegConfig;
  public initialLevel!: number;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> FORM BUILDER <==========
  public get FormUtils(): typeof FormUtils { return FormUtils }

  // #region FORM FIELDS
  public form: FormGroup = new FormGroup({
    Tenant_Id: new FormControl<number>(0),
    Id: new FormControl<number>(0),
    QtnMinima: new FormControl<number>(1, Validators.min(-1)),
    Is_Numeros: new FormControl<boolean>(false),
    Is_LetrasMaiusculas: new FormControl<boolean>(false),
    Is_CaracteresEspeciais: new FormControl<boolean>(false),
    QtnTrocaSenha: new FormControl<number>(-1, Validators.min(-1)),
    QtnInatividade: new FormControl<number>(-1, Validators.min(-1)),
    QtnTentativa: new FormControl<number>(1, Validators.min(-1)),
    QtnRepeticao: new FormControl<number>(1, Validators.min(-1)),
    Is_DropSession: new FormControl<boolean>(false),
    Level: new FormControl<number>(1)
  });

  public get Id(): number { return this.form.get('Id')?.value }
  public get Level(): number { return this.form.get('Level')?.value }
  // #endregion FORM FIELDS

  // #endregion ==========> FORM BUILDER <==========


  // #region ==========> INITIALIZATION <==========
  constructor(
    private _configuracaoSenhaService: ConfiguracaoSenhaService,
    private _messageService: MessageService,
    private _dominio: TenantService,
    private _title: Title
    
    // private _projectUtilservice: ProjectUtilservice,
    // private _projectService: ProjectService,
    // private _authStorage: AuthStorageService,
  ) {
  }
  
  ngOnInit(): void {
    this._title.setTitle("Configuração de Senha");
    
    this._dominio.validateTenant(this._localTenantId);
    this.getInfraSegConfig();
  }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> SERVICE METHODS <==========

  // #region GET
  private getInfraSegConfig(): void {
    this._configuracaoSenhaService.getInfraSegConfig().subscribe({
      next: response => {
        this.$infraSegConfigRecord = response.InfraSegConfig;

        this.form.patchValue({
          ...this.form.value,
          ...response.InfraSegConfig
        });
        
        this.initialLevel = response.InfraSegConfig.Level || 1;
        this.form.controls['Tenant_Id'].setValue(this._localTenantId);

        this.onSelectLevel(this.Level);
      },
      error: error => {
        // this._projectUtilservice.showHttpError(error)
        this.onSelectLevel(this.Level);
        this.$infraSegConfigRecord = new InfraSegConfig();

        this._messageService.showAlertDanger(error);
        throw new Error(error);
      }
    });
  }
  // #endregion GET

  // #region POST
  public createOrUpdateInfraSegConfig(): void {
    this.form.enable();

    if (this.form.valid) {
      this._configuracaoSenhaService.createOrUpdateInfraSegConfig(this.form.value).subscribe({
        next: () => {
          this.initialLevel = this.Level;

          this._messageService.showAlertSuccess(`Configuração de senha ${this.Id != 0 ? 'alterada' : 'criada'} com sucesso!`);
          
          // if (this.ID != 0) this._messageService.showAlertSuccess('Configuração de senha alterada com sucesso!');
          // else              this._messageService.showAlertSuccess('Configuração de senha criada com sucesso!');
          
          this._configuracaoSenhaService.getInfraSegConfig();
          this.getInfraSegConfig();
        },
        error: error => {
          // this._projectUtilservice.showHttpError(error);
          this._messageService.showAlertDanger(error);
          throw new Error(error);
        }
      });

    }
    else { FormUtils.validateFields(this.form) }
  }
  // #endregion POST

  // #endregion ==========> SERVICE METHODS <==========


  // #region ==========> UTILS <==========
  onSelectLevel($value: number | string) {
    switch ($value) {
      case 1:
        this.form.get('Is_Numeros')?.setValue(false);
        this.form.get('Is_Numeros')?.disable();

        this.form.get('Is_LetrasMaiusculas')?.setValue(false);
        this.form.get('Is_LetrasMaiusculas')?.disable();

        this.form.get('Is_CaracteresEspeciais')?.setValue(false);
        this.form.get('Is_CaracteresEspeciais')?.disable();

        this.form.get('QtnTrocaSenha')?.setValue(-1);
        this.form.get('QtnTrocaSenha')?.disable();

        this.form.get('QtnMinima')?.setValue(6);
        this.form.get('QtnMinima')?.disable();

        this.form.get('QtnRepeticao')?.setValue(-1);
        this.form.get('QtnRepeticao')?.disable();

        this.form.get('QtnTentativa')?.setValue(-1);
        this.form.get('QtnTentativa')?.disable();

        this.form.get('QtnInatividade')?.setValue(-1);
        this.form.get('QtnInatividade')?.disable();
        break;

      case 2:
        this.form.get('Is_Numeros')?.setValue(true);
        this.form.get('Is_Numeros')?.disable();

        this.form.get('Is_LetrasMaiusculas')?.setValue(true);
        this.form.get('Is_LetrasMaiusculas')?.disable();

        this.form.get('Is_CaracteresEspeciais')?.setValue(false);
        this.form.get('Is_CaracteresEspeciais')?.disable();

        this.form.get('QtnTrocaSenha')?.setValue(120);
        this.form.get('QtnTrocaSenha')?.disable();

        this.form.get('QtnMinima')?.setValue(8);
        this.form.get('QtnMinima')?.disable();

        this.form.get('QtnRepeticao')?.setValue(1);
        this.form.get('QtnRepeticao')?.disable();

        this.form.get('QtnTentativa')?.setValue(5);
        this.form.get('QtnTentativa')?.disable();

        this.form.get('QtnInatividade')?.setValue(120);
        this.form.get('QtnInatividade')?.disable();
        break;

      case 3:
        this.form.get('Is_Numeros')?.setValue(true);
        this.form.get('Is_Numeros')?.disable();

        this.form.get('Is_LetrasMaiusculas')?.setValue(true);
        this.form.get('Is_LetrasMaiusculas')?.disable();

        this.form.get('Is_CaracteresEspeciais')?.setValue(true);
        this.form.get('Is_CaracteresEspeciais')?.disable();

        this.form.get('QtnTrocaSenha')?.setValue(30);
        this.form.get('QtnTrocaSenha')?.disable();

        this.form.get('QtnMinima')?.setValue(10);
        this.form.get('QtnMinima')?.disable();

        this.form.get('QtnRepeticao')?.setValue(3);
        this.form.get('QtnRepeticao')?.disable();

        this.form.get('QtnTentativa')?.setValue(3);
        this.form.get('QtnTentativa')?.disable();

        this.form.get('QtnInatividade')?.setValue(30);
        this.form.get('QtnInatividade')?.disable();
        break;

      case 4:
        this.form.get('Is_Numeros')?.enable();
        this.form.get('Is_LetrasMaiusculas')?.enable();
        this.form.get('Is_CaracteresEspeciais')?.enable();
        this.form.get('QtnTrocaSenha')?.enable();
        this.form.get('QtnMinima')?.enable();
        this.form.get('QtnRepeticao')?.enable();
        this.form.get('QtnTentativa')?.enable();
        this.form.get('QtnInatividade')?.enable();
        break;
    }
  }

  public onSubmit = (): void => { this.createOrUpdateInfraSegConfig() };
  // #endregion ==========> UTILS <==========

}
