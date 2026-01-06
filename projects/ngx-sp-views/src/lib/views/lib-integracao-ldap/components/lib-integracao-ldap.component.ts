import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { FieldErrorMessageComponent, FormUtils, LibComboboxComponent, LibHeaderComponent, LibIconsComponent, MessageService, ModalUtilsService, RecordCombobox } from 'ngx-sp-infra';

import { InfraLDAP } from '../models/InfraLDAP';
import { LDAPValidateUser } from '../models/LDAPValidateUser';
import { IntegracaoAdLdapService } from '../services/integracao-ad-ldap.service';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { UsuariosLDAPComponent } from './usuarios-ldap/usuarios-ldap.component';

@Component({
  selector: 'lib-lib-integracao-ldap, lib-integracao-ldap',
  imports: [ RouterLink, NgIf, FormsModule, ReactiveFormsModule, LibIconsComponent, FieldErrorMessageComponent, LibComboboxComponent, LibHeaderComponent, UsuariosLDAPComponent],
  templateUrl: './lib-integracao-ldap.component.html',
  styleUrl: './lib-integracao-ldap.component.scss'
})
export class LibIntegracaoLdapComponent {

  constructor(
    public _modalUtils: ModalUtilsService,
    private _messageService: MessageService,
    private _integracaoLDAPService: IntegracaoAdLdapService,
    private _router: Router,
    //private _toastrService: ToastrService
  ) {
  }

  ngOnInit(): void {


    if (!this.tenant_Id || this.tenant_Id == 0) {
      this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")
      this._router.navigate(["/home"]);
    }

    this.getInitialValues();
  }
  public modalOptions: ModalOptions = {
    id: 1,
    class: 'modal-dialog-centered modal-lg',
  }

  private _ldapID: number = 0;
  public btnHidden: boolean = false;
  public gruposList: RecordCombobox[] = [];
  public infraLDAP: InfraLDAP = new InfraLDAP();
  public editMode: boolean = false;
  public password: string = "";

  @Input() tenant_Id: number = 0;
  @Input() isConfigGeral?: boolean = false;

  public get FormUtils(): typeof FormUtils { return FormUtils }

  public form: FormGroup = new FormGroup({
    Descricao: new FormControl<string>("", [Validators.required]),
    Hostname: new FormControl<string>("", [Validators.required]),
    Path: new FormControl<string>("", [Validators.required]),
    SearchDN: new FormControl<string>("", [Validators.required]),
    GrupodDefaultId: new FormControl<string>("", [Validators.required]),
    Is_RequireAprov: new FormControl<string>("", [Validators.required]),
    Is_LDAPS: new FormControl<string>("", [Validators.required]),
    Is_Active: new FormControl<string>("", [Validators.required])
  })

  public validateUserLDAPForm: FormGroup = new FormGroup({
    Username: new FormControl<string>("", [Validators.maxLength(100)]),
    Password: new FormControl<string>("", [Validators.maxLength(100)])
  })

  public getInitialValues() {
    this._integracaoLDAPService.GetGrupoDefaultIdList().subscribe({
      next: response => {
        this.gruposList = response.Records
      },
      error: error => {
        //this._toastrService.error(error.message)
      }

    })
    this._integracaoLDAPService.getByTenantId().subscribe({
      next: response => {
        this.infraLDAP = response.InfraLDAP
        this._ldapID = response.InfraLDAP.Id

        this.form.patchValue({
          ...this.form.value,
          ...response.InfraLDAP
        })

        this.editMode = true;
      },
      error: error => {

        if (error.toString() == `Error: O registro com chave '${this.tenant_Id}' não foi encontrado.`) {
          this._messageService.showAlertInfo('Este domínio ainda não possuí registro de integração AD/LDAP registrado.');
        } else {
          //this._toastrService.error(error.message)
        }

        this.infraLDAP = new InfraLDAP();
        this.infraLDAP.Tenant_Id = this.tenant_Id
      }

    })

  }

  public onSubmit() {

    if (this.form.valid) {

      this.infraLDAP = this.form.getRawValue() as InfraLDAP;

      this.infraLDAP.Tenant_Id = this.tenant_Id;
      this.infraLDAP.Id = this._ldapID;
      this.infraLDAP.Username = "";
      this.infraLDAP.Password = "";

      this._integracaoLDAPService.createOrUpdate(this.infraLDAP).subscribe({
        next: response => {

          if (this.editMode) {
            this._messageService.showAlertSuccess(`Registro alterado com sucesso!`)
          } else {
            this._messageService.showAlertSuccess(`Registro inserido com sucesso!`)
          }

          this.getInitialValues();
        },
        error: error => {
          this._messageService.showAlertDanger(error)
        }

      })
    }
  }

  public toggleBtnDisplay() {
    this.btnHidden = !this.btnHidden;
  }

  public validateUserinLDAP() {

    if (this.form.valid) {

      let ldapValidateUser: LDAPValidateUser = {
        IsLDAPS: this.form.get('Is_LDAPS')?.value,
        HostName: this.form.get('Hostname')?.value,
        Path: this.form.get('Path')?.value,
        User: this.validateUserLDAPForm.get('Username')?.value,
        Password: this.validateUserLDAPForm.get('Password')?.value
      }

      this._integracaoLDAPService.validateUserinLDAP(ldapValidateUser).subscribe({
        next: response => {
          this._messageService.showAlertSuccess(`Validação com sucesso!`)

          this._modalUtils.closeModal(1)
        },
        error: error => {
          this._messageService.showAlertDanger(error)
        }

      })
    }
  }


}
