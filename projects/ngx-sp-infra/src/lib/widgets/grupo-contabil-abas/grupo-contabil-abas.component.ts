import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { links } from './models/links-record';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-grupo-contabil-abas',
  imports: [NgFor],
  templateUrl: './grupo-contabil-abas.component.html',
  styleUrl: './grupo-contabil-abas.component.scss'
})
export class GrupoContabilAbasComponent {

   public linksList: links[] = [];
  @Input() Id: string | number = "";

  public activeItem: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {

    if(window.location.host.includes("localhost")){
      this.linksList.push(
      { nome: 'Grupo Contabil', uri: `http://${window.location.host}/grupo-contabil/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Dados Compras', uri: `http://${window.location.host}/SpCopConfiguracoes/GrpContabil/editar/${this.Id}`, isTargetSelf: false},
    );
    }else{
      this.linksList.push(
      { nome: 'Grupo Contabil', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/grupo-contabil/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Dados Compras', uri: `https://${window.location.host}/SisproErpCloud/Compras/SpCopConfiguracoes/GrpContabil/editar/${this.Id}`, isTargetSelf: false},
    );
    }

    this.activeItem = this.router.url;

  }

}
