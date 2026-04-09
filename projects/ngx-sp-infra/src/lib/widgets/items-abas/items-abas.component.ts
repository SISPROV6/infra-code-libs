import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { links } from './models/links-record';
import { NgFor } from '@angular/common';
import { HostOutsystemsServerService } from '../empresa-abas/host-outsystems-server.service';
import { MessageService } from '../../message/message.service';
import { InfraErpModuloRecord } from '../pessoa-abas/models/InfraErpModuloRecord';
import { firstValueFrom } from 'rxjs';
import { PessoaService } from '../pessoa-abas/service/pessoa.service';
import { ProjetosLicenciadRecord } from '../empresa-abas/models/ProjetosLicenciadoRecord';

@Component({
  selector: 'lib-items-abas',
  imports: [NgFor],
  templateUrl: './items-abas.component.html',
  styleUrl: './items-abas.component.scss'
})
export class ItemsAbasComponent {

  public hostServerOutsystem = ""
  public linksList: links[] = [];
  @Input() Id: string | number = "";
  @Input() hostServerOutsystemValue: string = "";
  @Output() ItemId = new EventEmitter<string | number>();

  public activeItem: string = '';

  public hasCompras: boolean = false;
  public hasCorporativo: boolean = false;
  public hasEstoque: boolean = false;

  public isComprasValid: boolean = false;
  public isCorporativoValid: boolean = false;
  public isEstoqueValid: boolean = false;

  public ProjetosLicenciadoList: ProjetosLicenciadRecord[] = [];

  constructor(
    private router: Router,
    private _hostOutsystemsServerService: HostOutsystemsServerService,
    private _messageService: MessageService,
  ) { }

  async ngOnInit() {

    await this.GetProjetosLicenciado();

    this.GetHostServerOutSystems();
    this.activeItem = this.router.url;

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['Id'] && changes['Id'].currentValue) {
      this.ItemId.emit(this.Id);
    }
  }


  public GetHostServerOutSystems(): void {
    this._hostOutsystemsServerService.GetHostServerOutSystems(0).subscribe({
      next: (response) => {
        this.hostServerOutsystem = response.String;

        if (window.location.host.includes("localhost")) {
          if (this.hasCorporativo) {
            this.linksList.push(
              { nome: 'Corporativo', uri: `http://${window.location.host}/itens/editar/${this.Id}`, isTargetSelf: true, disable: this.isCorporativoValid }
            );
          }

          if (this.hasEstoque) {
            this.linksList.push(
              { nome: 'Estoque', uri: `http://${window.location.host}/SpEtq1Etq/ItemParaSuprimentos/editar/${this.Id}`, isTargetSelf: true, disable: this.isEstoqueValid }
            );
          }

          if (this.hasCompras) {
            this.linksList.push(
              { nome: 'Dados Compras', uri: `http://${window.location.host}/item-dados-compras/editar/${this.Id}`, isTargetSelf: false, disable: this.isComprasValid }
            );
          }

        } else {
          if (this.hasCorporativo) {
            this.linksList.push(
              { nome: 'Corporativo', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/itens/editar/${this.Id}`, isTargetSelf: true, disable: this.isCorporativoValid },
            );
          }

          if (this.hasEstoque) {
            this.linksList.push(
              // { nome: 'Estoque', uri: `${this.hostServerOutsystemValue}/SpEtq1Etq/ItemParaSuprimentos/editar/${this.Id}`, isTargetSelf: true},
              { nome: 'Estoque', uri: `${this.hostServerOutsystem}/SpEtq1Etq/ItemEstoque.aspx?IsCorp=True&CrpItemId=${this.Id}`, isTargetSelf: true, disable: this.isEstoqueValid  },
            );
          }
          
          if (this.hasCompras) {
            this.linksList.push(
              // {nome: 'Dados Compras', uri: `${this.hostServerOutsystemValue}/item-dados-compras/editar/${this.Id}`, isTargetSelf: false},
              { nome: 'Dados Compras', uri: `${this.hostServerOutsystem}/SpCop3Configuracoes/ItemDadosCompras.aspx?CrpItemId=${this.Id}`, isTargetSelf: false, disable: this.isComprasValid },
            );
          }

        }

      },
      error: error => {
        this._messageService.showAlertDanger(error);
        throw new Error(error);
      }
    });
  }

  public async GetProjetosLicenciado(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this._hostOutsystemsServerService.GetProjetosLicenciado()
      );

      this.ProjetosLicenciadoList = response.ProjetosLicenciado;

      for (const projeto of this.ProjetosLicenciadoList){

        switch (projeto.Item1) {


          case 9:
            this.hasCompras = true;

            this.isComprasValid = await this.IsMenuAllowed("Compras/item-dados-compras");
            break;

          case 11:
            this.hasEstoque = true;

            this.isEstoqueValid = await this.IsMenuAllowed("Estoque//SpEtq1Etq/ItemParaSuprimentos");
            break;

          case 1:
            this.hasCorporativo = true;

            this.isCorporativoValid = await this.IsMenuAllowed("itens");
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
