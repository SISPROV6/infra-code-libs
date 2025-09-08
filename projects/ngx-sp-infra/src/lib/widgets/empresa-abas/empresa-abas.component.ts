import { Component, EventEmitter, Input, input, OnInit, Output, output, SimpleChanges } from '@angular/core';
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
  @Output() EmpresaId = new EventEmitter<string | number>();

  public activeItem: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    if(window.location.host.includes("localhost")){
      this.linksList.push(
      { nome: 'Empresa', uri: `http://${window.location.host}/empresas/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Contábil', uri: `http://${window.location.host}/perfilDaEmpresa?InfraEmpresaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Estoque', uri: `http://${window.location.host}/SpEtq1Etq/EmpresaEstoque/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Compras', uri: `http://${window.location.host}/SpCopConfiguracoes/EmpresaCompras/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Recebimento', uri: `http://${window.location.host}/SpRec1Cfg/ConfiguracaoEmpresa/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Fiscal', uri: `http://${window.location.host}/perfil-da-empresa/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Patrimônio', uri: `http://siscandesv10.sispro.com.br/SpPat1Conf/EmpresaPatrimonio.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Aprovação', uri: `http://${window.location.host}/empresas/editar/aprovacao/${this.Id}`, isTargetSelf: false},
      {nome: 'Financeiro', uri: `http://siscandesv10.sispro.com.br/SpFin1Cadastros/FinEmpresaParam_Edit.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Reinf', uri: `http://siscandesv10.sispro.com.br/SpReinf1Cad/ReinfEmpresa_List.aspx?InfraEmpresaId=${this.Id}&IsCorp=True`, isTargetSelf: false},
      {nome: 'ECF/TAX', uri: `http://siscandesv10.sispro.com.br/SpGcf2Cadastros/GcfEmpresa_List.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false},
      {nome: 'SCP', uri: `http://${window.location.host}/empresas/editar/SCP/${this.Id}`, isTargetSelf: false},
    );
    }else{
      this.linksList.push(
      { nome: 'Empresa', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/empresas/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Contábil', uri: `https://${window.location.host}/SisproErpCloud/Contabilidade/perfilDaEmpresa?InfraEmpresaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Estoque', uri: `https://${window.location.host}/SisproErpCloud/Estoque/SpEtq1Etq/EmpresaEstoque/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Compras', uri: `https://${window.location.host}/SisproErpCloud/Compras/SpCopConfiguracoes/EmpresaCompras/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Recebimento', uri: `https://${window.location.host}/SisproErpCloud/Recebimento/SpRec1Cfg/ConfiguracaoEmpresa/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Fiscal', uri: `https://${window.location.host}/SisproErpCloud/Efd-Reinf/perfil-da-empresa/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Patrimônio', uri: `https://siscandesv10.sispro.com.br/SpPat1Conf/EmpresaPatrimonio.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Aprovação', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/empresas/editar/aprovacao/${this.Id}`, isTargetSelf: false},
      {nome: 'Financeiro', uri: `https://siscandesv10.sispro.com.br/SpFin1Cadastros/FinEmpresaParam_Edit.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Reinf', uri: `https://siscandesv10.sispro.com.br/SpReinf1Cad/ReinfEmpresa_List.aspx?InfraEmpresaId=${this.Id}&IsCorp=True`, isTargetSelf: false},
      {nome: 'ECF/TAX', uri: `https://siscandesv10.sispro.com.br/SpGcf2Cadastros/GcfEmpresa_List.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false},
      {nome: 'SCP', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/empresas/editar/SCP/${this.Id}`, isTargetSelf: false},
    );
    }
    
    this.activeItem = this.router.url;
  }

    ngOnChanges(changes: SimpleChanges) {
    if (changes['Id'] && changes['Id'].currentValue) {
        this.EmpresaId.emit(this.Id);
    }
  }

}
