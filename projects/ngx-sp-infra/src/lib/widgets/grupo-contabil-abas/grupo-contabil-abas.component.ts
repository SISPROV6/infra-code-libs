import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { links } from './models/links-record';

@Component({
  selector: 'lib-grupo-contabil-abas',
  imports: [NgFor],
  templateUrl: './grupo-contabil-abas.component.html',
  styleUrl: './grupo-contabil-abas.component.scss'
})
export class GrupoContabilAbasComponent {

  public linksList: links[] = [];
  @Input() Id: string | number = "";
  @Output() GrupoContabilId = new EventEmitter<string | number>();

  public activeItem: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {

    if (window.location.host.includes("localhost")) {
      this.linksList.push(
        { nome: 'Grupo contábil', uri: `http://${window.location.host}/grupo-contabil/editar/${this.Id}`, isTargetSelf: true },
        { nome: 'Dados compras', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Compras/grupo-contabil/editar/${this.Id}`, isTargetSelf: false }
      );
    } else {
      this.linksList.push(
        { nome: 'Grupo contábil', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/grupo-contabil/editar/${this.Id}`, isTargetSelf: true },
        { nome: 'Dados compras', uri: `https://${window.location.host}/SisproErpCloud/Compras/grupo-contabil/editar/${this.Id}`, isTargetSelf: false },
      );
    }

    this.activeItem = this.router.url;

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['Id'] && changes['Id'].currentValue) {
      this.GrupoContabilId.emit(this.Id);
    }
  }

}
