import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FormUtils } from '../../utils/form-utils';
import { MessageService } from '../../message/message.service';

import { InfraSegConfig } from '../../models/config-senha/7Db/InfraSegConfig.record';
import { ConfiguracaoSenhaService } from '../../service/configuracao-senha.service';
import { TenantService } from '../../service/tenant.service';

@Component({
  selector: 'lib-config-senha',
  templateUrl: './lib-config-senha.component.html',
  styles: ``
})
export class LibConfigSenhaComponent implements OnInit {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _localTenantId = JSON.parse(localStorage["user_auth_v6"]).__tokenPayload.tenantId ?? 0;
  // #endregion PRIVATE

  // #region PUBLIC
  // @Input() public customTenantID: number = 0;

  public menuGroup!: string;
  public keyWorld!: string;
  public $infraSegConfigRecord?: InfraSegConfig;
  public initialLevel!: number;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> FORM BUILDER <==========
  public get FormUtils(): typeof FormUtils { return FormUtils }

  // #region FORM FIELDS
  public form: FormGroup = new FormGroup({
    TENANT_ID: new FormControl<number>(0),
    ID: new FormControl<number>(0),
    QTNMINIMA: new FormControl<number>(0, Validators.min(-1)),
    IS_NUMEROS: new FormControl<boolean>(false),
    IS_LETRASMAIUSCULAS: new FormControl<boolean>(false),
    IS_CARACTERESESPECIAIS: new FormControl<boolean>(false),
    QTNTROCASENHA: new FormControl<number>(-1, Validators.min(-1)),
    QTNINATIVIDADE: new FormControl<number>(-1, Validators.min(-1)),
    QTNTENTATIVA: new FormControl<number>(1, Validators.min(-1)),
    QTNREPETICAO: new FormControl<number>(1, Validators.min(-1)),
    IS_DROPSESSION: new FormControl<boolean>(false),
    LEVEL: new FormControl<number>(0)
  });

  public get ID(): number { return this.form.get('ID')?.value }
  public get LEVEL(): number { return this.form.get('LEVEL')?.value }
  // #endregion FORM FIELDS

  // #endregion ==========> FORM BUILDER <==========


  // #region ==========> INITIALIZATION <==========
  constructor(
    private _configuracaoSenhaService: ConfiguracaoSenhaService,
    private _messageService: MessageService,
    private _route: ActivatedRoute,
    private _dominio: TenantService

    
    // private _projectUtilservice: ProjectUtilservice,
    // private _projectService: ProjectService,
    // private _authStorage: AuthStorageService,
  ) {
  }
  
  ngOnInit(): void {
    this._dominio.validateTenant(this._localTenantId);
    this.getInfraSegConfig();
    
    this._route.data.subscribe(response => {
      this.keyWorld = (response['keyWorld'])
    })
  }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> SERVICE METHODS <==========

  // #region PREPARATION
  // [...]
  // #endregion PREPARATION

  // #region GET
  private getInfraSegConfig(): void {
    this._configuracaoSenhaService.getInfraSegConfig().subscribe({
      next: response => {
        this.$infraSegConfigRecord = response.InfraSegConfig;

        this.form.patchValue({
          ...this.form,
          ...response.InfraSegConfig
        });

        this.initialLevel = response.InfraSegConfig.LEVEL || 0;
        
        console.log("this._localTenantId", this._localTenantId);
        this.form.controls['TENANT_ID'].setValue(this._localTenantId);

        this.onSelectLevel(this.LEVEL);
      },
      error: error => {
        // this._projectUtilservice.showHttpError(error)
        this.onSelectLevel(this.LEVEL);
        this.$infraSegConfigRecord = new InfraSegConfig();

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
          this.initialLevel = this.LEVEL;

          this._messageService.showAlertSuccess(`Configuração de senha ${this.ID != 0 ? 'alterada' : 'criada'} alterada com sucesso!`);

          // if (this.ID != 0) this._messageService.showAlertSuccess('Configuração de senha alterada com sucesso!');
          // else              this._messageService.showAlertSuccess('Configuração de senha criada com sucesso!');

          this._configuracaoSenhaService.getInfraSegConfig();
          this.getInfraSegConfig();
        },
        error: error => {
          // this._projectUtilservice.showHttpError(error);
          throw new Error(error);
        }
      });

    }
    else { FormUtils.validateFields(this.form) }
  }
  // #endregion POST

  // #region DELETE
  // [...]
  // #endregion DELETE

  // #endregion ==========> SERVICE METHODS <==========


  // #region ==========> UTILS <==========
  onSelectLevel($value: number | string) {
    switch ($value) {
      case 0:
        this.form.get('IS_NUMEROS')?.setValue(false);
        this.form.get('IS_NUMEROS')?.disable();

        this.form.get('IS_LETRASMAIUSCULAS')?.setValue(false);
        this.form.get('IS_LETRASMAIUSCULAS')?.disable();

        this.form.get('IS_CARACTERESESPECIAIS')?.setValue(false);
        this.form.get('IS_CARACTERESESPECIAIS')?.disable();

        this.form.get('QTNTROCASENHA')?.setValue(-1);
        this.form.get('QTNTROCASENHA')?.disable();

        this.form.get('QTNMINIMA')?.setValue(6);
        this.form.get('QTNMINIMA')?.disable();

        this.form.get('QTNREPETICAO')?.setValue(-1);
        this.form.get('QTNREPETICAO')?.disable();

        this.form.get('QTNTENTATIVA')?.setValue(-1);
        this.form.get('QTNTENTATIVA')?.disable();

        this.form.get('QTNINATIVIDADE')?.setValue(-1);
        this.form.get('QTNINATIVIDADE')?.disable();

        break

      case 1:
        this.form.get('IS_NUMEROS')?.setValue(true);
        this.form.get('IS_NUMEROS')?.disable();

        this.form.get('IS_LETRASMAIUSCULAS')?.setValue(true);
        this.form.get('IS_LETRASMAIUSCULAS')?.disable();

        this.form.get('IS_CARACTERESESPECIAIS')?.setValue(false);
        this.form.get('IS_CARACTERESESPECIAIS')?.disable();

        this.form.get('QTNTROCASENHA')?.setValue(120);
        this.form.get('QTNTROCASENHA')?.disable();

        this.form.get('QTNMINIMA')?.setValue(8);
        this.form.get('QTNMINIMA')?.disable();

        this.form.get('QTNREPETICAO')?.setValue(1);
        this.form.get('QTNREPETICAO')?.disable();

        this.form.get('QTNTENTATIVA')?.setValue(5);
        this.form.get('QTNTENTATIVA')?.disable();

        this.form.get('QTNINATIVIDADE')?.setValue(120);
        this.form.get('QTNINATIVIDADE')?.disable();

        break

      case 2:
        this.form.get('IS_NUMEROS')?.setValue(true);
        this.form.get('IS_NUMEROS')?.disable();

        this.form.get('IS_LETRASMAIUSCULAS')?.setValue(true);
        this.form.get('IS_LETRASMAIUSCULAS')?.disable();

        this.form.get('IS_CARACTERESESPECIAIS')?.setValue(true);
        this.form.get('IS_CARACTERESESPECIAIS')?.disable();

        this.form.get('QTNTROCASENHA')?.setValue(30);
        this.form.get('QTNTROCASENHA')?.disable();

        this.form.get('QTNMINIMA')?.setValue(10);
        this.form.get('QTNMINIMA')?.disable();

        this.form.get('QTNREPETICAO')?.setValue(3);
        this.form.get('QTNREPETICAO')?.disable();

        this.form.get('QTNTENTATIVA')?.setValue(3);
        this.form.get('QTNTENTATIVA')?.disable();

        this.form.get('QTNINATIVIDADE')?.setValue(30);
        this.form.get('QTNINATIVIDADE')?.disable();

        break;

      case 3:
        this.form.get('IS_NUMEROS')?.enable();
        this.form.get('IS_LETRASMAIUSCULAS')?.enable();
        this.form.get('IS_CARACTERESESPECIAIS')?.enable();
        this.form.get('QTNTROCASENHA')?.enable();
        this.form.get('QTNMINIMA')?.enable();
        this.form.get('QTNREPETICAO')?.enable();
        this.form.get('QTNTENTATIVA')?.enable();
        this.form.get('QTNINATIVIDADE')?.enable();
    }

  }

  public onSubmit() {
    this.createOrUpdateInfraSegConfig();
  }
  // #endregion ==========> UTILS <==========

}
