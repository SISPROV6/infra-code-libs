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
    this.linksList.push(
      { nome: 'Estoque', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Estoque/SpEtq1Etq/ItemParaSuprimentos/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Dados Compras', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Compras/SpCopConfiguracoes/ItemDadosCompras/editar/${this.Id}`, isTargetSelf: false},
    );

    this.activeItem = this.router.url;

  }

}
