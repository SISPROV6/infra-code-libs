import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { links } from './models/links-record';
import { NgFor } from '@angular/common';
import { HostOutsystemsServerService } from '../empresa-abas/host-outsystems-server.service';
import { MessageService } from '../../message/message.service';

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

  constructor(
    private router: Router,
    private _hostOutsystemsServerService: HostOutsystemsServerService,
    private _messageService: MessageService) { }

  ngOnInit(): void {

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
          this.linksList.push(
            { nome: 'Corporativo', uri: `http://${window.location.host}/itens/editar/${this.Id}`, isTargetSelf: true },
            { nome: 'Estoque', uri: `http://${window.location.host}/SpEtq1Etq/ItemParaSuprimentos/editar/${this.Id}`, isTargetSelf: true },
            { nome: 'Dados Compras', uri: `http://${window.location.host}/item-dados-compras/editar/${this.Id}`, isTargetSelf: false },
          );
        } else {
          this.linksList.push(
            { nome: 'Corporativo', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/itens/editar/${this.Id}`, isTargetSelf: true },
            // { nome: 'Estoque', uri: `${this.hostServerOutsystemValue}/SpEtq1Etq/ItemParaSuprimentos/editar/${this.Id}`, isTargetSelf: true},
            { nome: 'Estoque', uri: `${this.hostServerOutsystem}/SpEtq1Etq/ItemEstoque.aspx?IsCorp=True&CrpItemId=${this.Id}`, isTargetSelf: true },
            // {nome: 'Dados Compras', uri: `${this.hostServerOutsystemValue}/item-dados-compras/editar/${this.Id}`, isTargetSelf: false},
            { nome: 'Dados Compras', uri: `${this.hostServerOutsystem}/SpCop3Configuracoes/ItemDadosCompras.aspx?CrpItemId=${this.Id}`, isTargetSelf: false },
          );
        }

      },
      error: error => {
        this._messageService.showAlertDanger(error);
        throw new Error(error);
      }
    });
  }

}
