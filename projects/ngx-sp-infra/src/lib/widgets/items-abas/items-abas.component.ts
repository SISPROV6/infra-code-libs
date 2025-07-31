import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { links } from './models/links-record';
import { NgFor } from '@angular/common';

@Component({
  selector: 'lib-items-abas',
  imports: [NgFor],
  templateUrl: './items-abas.component.html',
  styleUrl: './items-abas.component.scss'
})
export class ItemsAbasComponent {

   public linksList: links[] = [];
  @Input() Id: string | number = "";

  public activeItem: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {

    if(window.location.host.includes("localhost")){
      this.linksList.push(
      { nome: 'Estoque', uri: `http://${window.location.host}/SpEtq1Etq/ItemParaSuprimentos/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Dados Compras', uri: `http://${window.location.host}/SpCopConfiguracoes/ItemDadosCompras/editar/${this.Id}`, isTargetSelf: false},
    );
    }else{
      this.linksList.push(
      { nome: 'Estoque', uri: `https://${window.location.host}/SisproErpCloud/Estoque/SpEtq1Etq/ItemParaSuprimentos/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Dados Compras', uri: `https://${window.location.host}/SisproErpCloud/Compras/SpCopConfiguracoes/ItemDadosCompras/editar/${this.Id}`, isTargetSelf: false},
    );
    }

    this.activeItem = this.router.url;

  }

}
