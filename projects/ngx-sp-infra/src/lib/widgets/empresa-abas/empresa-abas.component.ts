import { Component, Input, input, OnInit } from '@angular/core';
import { links } from './models/links-record';
import { NgFor} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-empresa-abas',
  imports: [NgFor],
  templateUrl: './empresa-abas.component.html',
  styleUrl: './empresa-abas.component.scss'
})
export class EmpresaAbasComponent implements OnInit{

  public linksList: links[] = [];
  @Input() Id: string | number = "";
  public uri: links = new links();

  public activeItem: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.linksList.push(
      { nome: 'Empresa', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Corporativo/empresas/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Contábil', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Contabilidade/perfilDaEmpresa/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Estoque', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Estoque/SpEtq1Etq/EmpresaEstoque/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Compras', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Compras/SpCopConfiguracoes/EmpresaCompras/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Recebimento', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Recebimento/SpRec1Cfg/ConfiguracaoEmpresa/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Fiscal', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Efd-Reinf/perfil-da-empresa/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Patrimônio', uri: `https://siscandesv10.sispro.com.br/SpPat1Conf/EmpresaPatrimonio.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Aprovação', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Corporativo/empresas/editar/aprovacao/${this.Id}`, isTargetSelf: false},
      {nome: 'Financeiro', uri: `https://siscandesv10.sispro.com.br/SpFin1Cadastros/FinEmpresaParam_Edit.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Reinf', uri: `https://siscandesv10.sispro.com.br/SpReinf1Cad/ReinfEmpresa_List.aspx?InfraEmpresaId=${this.Id}&IsCorp=True`, isTargetSelf: false},
      {nome: 'ECF/TAX', uri: `https://siscandesv10.sispro.com.br/SpGcf2Cadastros/GcfEmpresa_List.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false},
      {nome: 'SCP', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Corporativo/empresas/editar/SCP/${this.Id}`, isTargetSelf: false},
    );

    this.activeItem = this.router.url;

  }

}
