import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { links } from './models/links-record';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { EstabelecimentoService } from '../estabelecimento-abas/service/estabelecimento.service';
import { MessageService } from '../../message/message.service';import { firstValueFrom } from 'rxjs';
import { ProjetosLicenciadRecord } from '../empresa-abas/models/ProjetosLicenciadoRecord';
import { HostOutsystemsServerService } from '../empresa-abas/host-outsystems-server.service';
;

@Component({
  selector: 'lib-usuario-abas',
  imports: [NgFor],
  templateUrl: './usuario-abas.component.html',
  styleUrl: './usuario-abas.component.scss'
})
export class UsuarioAbasComponent {

   public linksList: links[] = [];
  @Input() Id: string | number = "";
  @Input() hostServerOutsystemValue: string | number = "";
  @Output() UsuarioId = new EventEmitter<string | number>();

  public activeItem: string = '';
  public hasEstoque: boolean = false;
  public hasCorporativo: boolean = false;

  public isEstoqueValid: boolean = false;
  public isCorporativoValid: boolean = false;

  public ProjetosLicenciadoList: ProjetosLicenciadRecord[] = [];

  constructor(
    private router: Router,
    private _hostOutsystemsServerService: HostOutsystemsServerService,
    private _messageService: MessageService,
  ) { }

  async ngOnInit() {

    await this.GetProjetosLicenciado();

    if(window.location.host.includes("localhost")){

      if (this.hasCorporativo) {
        this.linksList.push(
          { nome: 'Usuário', uri: `http://${window.location.host}/usuarios/editarUsuarios/${this.Id}`, isTargetSelf: true, disable: this.isCorporativoValid },
          //{nome: 'Pessoa', uri: `http://${window.location.host}/usuarios/pessoas/${this.Id}`, isTargetSelf: false} ,
          { nome: 'Pessoa', uri: `${this.hostServerOutsystemValue}/SpCrp1Empresa/UsuarioPessoa.aspx?IsCorp=True&UsuarioId=${this.Id}`, isTargetSelf: false, disable: this.isCorporativoValid },
        )
      }

      if (this.hasEstoque) {
        this.linksList.push(
          {nome: 'Estoque', uri: `http://${window.location.host}/SpEtq1Etq/usuarios/editar/${this.Id}`, isTargetSelf: false, disable: this.isEstoqueValid},
        )
      };

    }else{
      if (this.hasCorporativo) {
        this.linksList.push(
          { nome: 'Usuário', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/usuarios/editarUsuarios/${this.Id}`, isTargetSelf: true, disable: this.isCorporativoValid },
          // {nome: 'Pessoa', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/usuarios/pessoas/${this.Id}`, isTargetSelf: false},
          { nome: 'Pessoa', uri: `${this.hostServerOutsystemValue}/SpCrp1Empresa/UsuarioPessoa.aspx?IsCorp=True&UsuarioId=${this.Id}`, isTargetSelf: false, disable: this.isCorporativoValid },
        );
      }


      if (this.hasEstoque) {
        this.linksList.push(
          // {nome: 'Estoque', uri: `${this.hostServerOutsystemValue}/SpEtq1Etq/usuarios/editar/${this.Id}`, isTargetSelf: false},
          { nome: 'Estoque', uri: `${this.hostServerOutsystemValue}/SpEtq1Etq/UsuarioEstoque.aspx?IsCorp=True&UsuarioId=${this.Id}`, isTargetSelf: false, disable: this.isEstoqueValid },
        )
      }

    }

    this.activeItem = this.router.url;

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['Id'] && changes['Id'].currentValue) {
      this.UsuarioId.emit(this.Id);
    }
  }

  public async GetProjetosLicenciado(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this._hostOutsystemsServerService.GetProjetosLicenciado()
      );

      this.hasEstoque = false;
      this.ProjetosLicenciadoList = response.ProjetosLicenciado;

      for (const projeto of this.ProjetosLicenciadoList){

        switch (projeto.Item1) {

          case 11:
            this.hasEstoque = true;

            this.isEstoqueValid = await this.IsMenuAllowed("Estoque/SpEtq1Etq/usuarios");
          break;

          case 1:
            this.hasCorporativo = true;

            this.isCorporativoValid = await this.IsMenuAllowed("usuarios");
          break;


          default:
            break;
        }

      };

    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this._messageService.showAlertDanger(msg);
      throw new Error(msg);
    }
  }

  public async IsMenuAllowed(route: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this._hostOutsystemsServerService.IsMenuAllowed(route)
      );

      return response.Boolean;

    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this._messageService.showAlertDanger(msg);
      throw new Error(msg);
    }
  }

}
