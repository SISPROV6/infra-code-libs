import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  @Output() UsuarioId = new EventEmitter<string | number>();

  public activeItem: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {

    if(window.location.host.includes("localhost")){
      this.linksList.push(
      { nome: 'Usuário', uri: `http://${window.location.host}/usuarios/editarUsuarios/${this.Id}`, isTargetSelf: true},
      {nome: 'Pessoa', uri: `http://${window.location.host}/usuarios/pessoas/${this.Id}`, isTargetSelf: false},
      {nome: 'Estoque', uri: `http://${window.location.host}/SpEtq1Etq/usuarios/editar/${this.Id}`, isTargetSelf: false},
    );
    }else{
      this.linksList.push(
      { nome: 'Usuário', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/usuarios/editarUsuarios/${this.Id}`, isTargetSelf: true},
      {nome: 'Pessoa', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/usuarios/pessoas/${this.Id}`, isTargetSelf: false},
      {nome: 'Estoque', uri: `https://${window.location.host}/SisproErpCloud/Estoque/SpEtq1Etq/usuarios/editar/${this.Id}`, isTargetSelf: false},
    );
    }

    this.activeItem = this.router.url;

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['Id'] && changes['Id'].currentValue) {
      this.UsuarioId.emit(this.Id);
    }
  }


}
