import { Component } from '@angular/core';
import { IntegracaoAdLdapService } from '../../services/integracao-ad-ldap.service';
import { InfraModule, MessageService, ModalUtilsService } from 'ngx-sp-infra';
import { UsuarioLDAP } from '../../models/UsuarioLDAP.record';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'usuarios-ldap',
  imports: [InfraModule, FormsModule],
  templateUrl: './usuarios-ldap.component.html',
  styleUrl: './usuarios-ldap.component.scss'
})
export class UsuariosLDAPComponent {
  constructor(
    private _integracaoLDAPService: IntegracaoAdLdapService,
    private _messageService: MessageService,
    public modalUtils: ModalUtilsService,
  ) {}

  public usuarios: UsuarioLDAP[] = [];
  public configLDAP: number = 0;
  public search: string = '';
  public isloading: boolean = true;

  ngOnInit(): void {
    this.GetLDAPUsuariosList();
  }

  public GetLDAPUsuariosList() {
    this._integracaoLDAPService.GetLDAPUsuariosList().subscribe({
      next: response => { 
        this.usuarios = response.Usuarios;
        this.configLDAP = response.InfraConfigLDAP;
        this.isloading = false;
      },
      error: error => {
        this._messageService.showAlertInfo(error.toString());
        this.usuarios = [];
        this.isloading = false;
      }
    });
  }

  public SetInfraConfigLDAP(id: string,isLDAP: boolean) {
    this._integracaoLDAPService.SetInfraConfigLDAP(id, isLDAP, this.configLDAP).subscribe({
      next: () => {
      },
      error: error => { this._messageService.showAlertInfo(error.toString()); }
    });
  }

  get usuariosFiltrados() {
    return this.usuarios?.filter(i =>
      i.Nome?.toLowerCase().includes(this.search.toLowerCase()) ||
      i.User?.toLowerCase().includes(this.search.toLowerCase()) 
    ) || [];
  }
}
