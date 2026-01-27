import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { estabelecimentoUriRecord } from './models/estabelecimentoUriRecord';
import { HostOutsystemsServerService } from '../empresa-abas/host-outsystems-server.service';
import { MessageService } from '../../message/message.service';

@Component({
  selector: 'lib-estabelecimento-abas',
  imports: [NgFor],
  templateUrl: './estabelecimento-abas.component.html',
  styleUrl: './estabelecimento-abas.component.scss'
})
export class EstabelecimentoAbasComponent {

  public hostServerOutsystem = ""
  public linksList: estabelecimentoUriRecord[] = [];
  @Input() Id: string | number = "";
  @Input() empresaId: string | null = "";
  @Input() hostServerOutsystemValue: string = "";
  @Output() EstabId = new EventEmitter<string | number>();

  public activeItem: string = '';

  constructor(
    private router: Router,
    private _hostOutsystemsServerService: HostOutsystemsServerService,
    private _messageService: MessageService,
  ) { }

  ngOnInit(): void {

    this.GetHostServerOutSystems();
    this.activeItem = this.router.url;

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['Id'] && changes['Id'].currentValue) {
      this.EstabId.emit(this.Id);
    }
  }

  public GetHostServerOutSystems(): void {
    this._hostOutsystemsServerService.GetHostServerOutSystems(0).subscribe({
      next: (response) => {
        this.hostServerOutsystem = response.String;

        if (window.location.host.includes("localhost")) {
          this.linksList.push(
            { nome: 'Estabelecimento', uri: `http://${window.location.host}/estabelecimentos/editar/${this.Id}`, isTargetSelf: true },
            { nome: 'Recebimento', uri: `http://${window.location.host}/configuracao-estabelecimento/editar/${this.Id}`, isTargetSelf: false },
            { nome: 'Financeiro', uri: `http://${window.location.host}/empresa-estab/editar/estab/0?id=${this.Id}&empresaId=${this.empresaId}`, isTargetSelf: false },
            { nome: 'Fiscal', uri: `http://${window.location.host}/identificacao-da-entidade/editar/${this.Id}`, isTargetSelf: false },
            { nome: 'Compras', uri: `http://${window.location.host}/estabelecimento-compras/editar/${this.Id}`, isTargetSelf: false },
            { nome: 'Contratos', uri: `http://siscandesv10.sispro.com.br/SpCtr1Param/CtrGnCfgApl_Edit.aspx?EstabelecimentoId=${this.Id}&IsCorp=True`, isTargetSelf: false },
            { nome: 'Vendas', uri: `http://siscandesv10.sispro.com.br/SpNeg3Cfg/CfgEstabelecimento.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false },
            { nome: 'CNO', uri: `http://${window.location.host}/estabelecimentos/EstabCnoDet/${this.Id}`, isTargetSelf: false },
            { nome: 'Tributos', uri: `http://siscandesv10.sispro.com.br/SpFis1Interface/ConfigOrdemCalcImpostos.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false },
          )
        } else {
          this.linksList.push(
            { nome: 'Estabelecimento', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/estabelecimentos/editar/${this.Id}`, isTargetSelf: true },
            // {nome: 'Recebimento', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Recebimento/configuracao-estabelecimento/editar/${this.Id}`, isTargetSelf: false},
            { nome: 'Recebimento', uri: `${this.hostServerOutsystem}/SpRec1Cfg/EstabRecebimento.aspx?EstabelecimentoId=${this.Id}&IsCorp=True`, isTargetSelf: false },
            // {nome: 'Financeiro', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Financeiro/empresa-estab/editar/estab/0?id=${this.Id}&empresaId=${this.empresaId}`, isTargetSelf: false},
            { nome: 'Financeiro', uri: `${this.hostServerOutsystem}/SpFin1Cadastros/FinEstabParam_Edit.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false },
            // {nome: 'Fiscal', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Efd-Reinf/identificacao-da-entidade/editar/${this.Id}`, isTargetSelf: false},
            { nome: 'Fiscal', uri: `${this.hostServerOutsystem}/SpSped1Conf/IdentificacaoDaEntidade_list.aspx?IsFiscal=False&StartWizard=False&EstabelecimentoId=${this.Id}&IsCorp=True`, isTargetSelf: false },
            // {nome: 'Compras', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Compras/estabelecimento-compras/editar/${this.Id}`, isTargetSelf: false},
            { nome: 'Compras', uri: `${this.hostServerOutsystem}/SpCop3Configuracoes/EstabCompras.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false },
            { nome: 'Contratos', uri: `${this.hostServerOutsystem}/SpCtr1Param/CtrGnCfgApl_Edit.aspx?EstabelecimentoId=${this.Id}&IsCorp=True`, isTargetSelf: false },
            { nome: 'Vendas', uri: `${this.hostServerOutsystem}/SpNeg3Cfg/CfgEstabelecimento.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false },
            { nome: 'CNO', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/estabelecimentos/EstabCnoDet/${this.Id}`, isTargetSelf: false },
            { nome: 'Tributos', uri: `${this.hostServerOutsystem}/SpFis1Interface/ConfigOrdemCalcImpostos.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false },
          )
        }

      },
      error: error => {
        this._messageService.showAlertDanger(error);
        throw new Error(error);
      }
    });
  }

}
