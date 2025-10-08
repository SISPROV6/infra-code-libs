import { Component, Input, OnInit } from '@angular/core';
import { ListComponent } from '../list/list.component';
import { SubMenuItem, TelaItem } from '../sub-menu.component';

@Component({
  selector: 'app-nav-tabs',
  imports: [
    ListComponent
  ],
  templateUrl: './nav-tabs.component.html',
  styleUrl: './nav-tabs.component.scss',
})
export class NavTabsComponent implements OnInit {

  // #region ==========> PROPERTIES <==========

  // #region PUBLIC
  @Input() subMenus: SubMenuItem[] = [];
  @Input() hostName:string = "";
  @Input() activeItem?: string;

  public telasItem: TelaItem[] = [];
  public listaAtiva: string = '';
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor() { }

  ngOnInit(): void {
    if (this.subMenus.length != 0) {
      this.telasItem = this.subMenus[0].telasItem;
      this.listaAtiva = this.activeItem ?? this.subMenus[0].titulo;
    }
  }


  // #region ==========> UTILS <==========
  public abaActive(b: string): void {
    const index = this.subMenus.findIndex(submenu => {
      return submenu.titulo == b;
    });

    this.telasItem = this.subMenus[index].telasItem;
    this.listaAtiva = this.subMenus[index].titulo;
  }
  // #endregion ==========> UTILS <==========

}
