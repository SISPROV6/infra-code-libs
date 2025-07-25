import { Component, Input } from '@angular/core';
import { links } from './models/links-record';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'lib-usuario-abas',
  imports: [NgFor],
  templateUrl: './usuario-abas.component.html',
  styleUrl: './usuario-abas.component.scss'
})
export class UsuarioAbasComponent {

   public linksList: links[] = [];
  @Input() Id: string | number = "";
  public uri: links = new links();

  public activeItem: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.linksList.push(
      { nome: 'Usuário', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Corporativo/usuarios/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Pessoa', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Corporativo/usuarios/pessoas/${this.Id}`, isTargetSelf: false},
      {nome: 'Estoque', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Estoque/SpEtq1Etq/usuarios/editar/${this.Id}`, isTargetSelf: false},
    );

    this.activeItem = window.location.origin + this.router.url;
  }

}
