import { Component, Input, OnInit } from '@angular/core';
import { ListComponent } from '../list/list.component';
import { SubMenuItem, TelaItem } from '../sub-menu.component';


@Component({
  selector: 'app-nav-tabs',
  imports: [ListComponent],
  templateUrl: './nav-tabs.component.html',
  styleUrl: './nav-tabs.component.scss',
  standalone: true,
})
export class NavTabsComponent implements OnInit {

  @Input() subMenus: SubMenuItem[] = [];
  
  telasItem: TelaItem[] = [];
  listaAtiva: string = '';

  // abaAtivaPorNivel1: number[] = [];
  // itemAtivoPorNivel1: string[] = [];
  
  ngOnInit(): void {
    if(this.subMenus.length != 0) {
      this.telasItem = this.subMenus[0].telasItem;
      this.listaAtiva = this.subMenus[0].titulo;
    }
  }

  // setAbaAtiva(indexNivel1: number, indexNivel2: number, titulo: string) {
  //   this.abaAtivaPorNivel1[indexNivel1] = indexNivel2;
  //   this.itemAtivoPorNivel1[indexNivel1] = titulo;
  // }

  abaActive(b: string) {
    const index = this.subMenus.findIndex(submenu => {
      return submenu.titulo == b;
    });
    this.telasItem = this.subMenus[index].telasItem;
    this.listaAtiva = this.subMenus[index].titulo;
  }

}
