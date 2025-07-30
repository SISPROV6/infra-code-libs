import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { estabelecimentoUriRecord } from './models/estabelecimentoUriRecord';

@Component({
  selector: 'lib-estabelecimento-abas',
  imports: [NgFor],
  templateUrl: './estabelecimento-abas.component.html',
  styleUrl: './estabelecimento-abas.component.scss'
})
export class EstabelecimentoAbasComponent {

  public linksList: estabelecimentoUriRecord[] = [];
  @Input() Id: string | number = "";

  public activeItem: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {

    if(window.location.host.includes("localhost")){
      this.linksList.push(
      { nome: 'Estabelecimento', uri: `http://${window.location.host}/estabelecimentos/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Recebimento', uri: `http://${window.location.host}/SpRec1Cfg/ConfiguracaoEstabelecimento/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Financeiro', uri: `http://${window.location.host}/SpFin1Cadastros/FinEstabParam_Edit.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false},
      {nome: 'Fiscal', uri: `http://${window.location.host}/identificacao-da-entidade/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Compras', uri: `http://${window.location.host}/SpCopConfiguracoes/EstabCompras/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Contratos', uri: `http://${window.location.host}/SpCtr1Param/CtrGnCfgApl_Edit.aspx?EstabelecimentoId=${this.Id}&IsCorp=True`, isTargetSelf: false},
      {nome: 'Vendas', uri: `http://${window.location.host}/SpNeg3Cfg/CfgEstabelecimento.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false},
      {nome: 'CNO', uri: `http://${window.location.host}/empresas/editar/aprovacao/${this.Id}`, isTargetSelf: false},
      {nome: 'Tributos', uri: `http://${window.location.host}/SpFis1Interface/ConfigOrdemCalcImpostos.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false},
    )
    }else{
      this.linksList.push(
      { nome: 'Estabelecimento', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/estabelecimentos/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Recebimento', uri: `https://${window.location.host}/SisproErpCloud/Recebimento/SpRec1Cfg/ConfiguracaoEstabelecimento/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Financeiro', uri: `https://${window.location.host}/SpFin1Cadastros/FinEstabParam_Edit.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false},
      {nome: 'Fiscal', uri: `https://${window.location.host}/SisproErpCloud/Efd-Reinf/identificacao-da-entidade/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Compras', uri: `https://${window.location.host}/SisproErpCloud/Compras/SpCopConfiguracoes/EstabCompras/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Contratos', uri: `https://${window.location.host}/SpCtr1Param/CtrGnCfgApl_Edit.aspx?EstabelecimentoId=${this.Id}&IsCorp=True`, isTargetSelf: false},
      {nome: 'Vendas', uri: `https://${window.location.host}/SpNeg3Cfg/CfgEstabelecimento.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false},
      {nome: 'CNO', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/empresas/editar/aprovacao/${this.Id}`, isTargetSelf: false},
      {nome: 'Tributos', uri: `https://${window.location.host}/SpFis1Interface/ConfigOrdemCalcImpostos.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false},
    )
    }

    

    this.activeItem = this.router.url;

  }

}
