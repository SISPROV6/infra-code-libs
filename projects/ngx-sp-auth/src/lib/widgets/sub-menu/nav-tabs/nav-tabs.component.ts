import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ListComponent } from '../list/list.component';
import { SubMenuItem, TelaItem } from '../sub-menu.component';

@Component({
  selector: 'app-nav-tabs',
  imports: [ ListComponent ],
  templateUrl: './nav-tabs.component.html',
  styleUrl: './nav-tabs.component.scss',
})
export class NavTabsComponent implements OnInit, OnChanges {

  // #region ==========> PROPERTIES <==========

  // #region PUBLIC
  @Input() subMenus: SubMenuItem[] = [];
  @Input() hostName:string = '';
  @Input() activeItem?: string;

  @Output() onTituloSelecionado: EventEmitter<string | null> = new EventEmitter<string | null>();
  @Output() onTelaSelecionada: EventEmitter<string | null> = new EventEmitter<string | null>();

  public telasItem: TelaItem[] = [];
  public listaAtiva: string = '';
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor() { }

  ngOnInit(): void {
    if (this.subMenus.length != 0) {
      this.telasItem = this.subMenus.filter(e => e.titulo.includes(this.activeItem ?? ''))[0].telasItem;
      this.listaAtiva = this.activeItem ?? this.subMenus[0].titulo;

      if (this.activeItem && this.activeItem !== '') this.setAbaAtiva(this.activeItem);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeItem'].currentValue && changes['activeItem'].currentValue !== "") {
      this.setAbaAtiva(changes['activeItem'].currentValue);
    }

    if ((changes['subMenus'].currentValue && changes['subMenus'].currentValue !== "") && this.activeItem !== '') {
      this.setAbaAtiva(this.activeItem!);
    }
  }


  // #region ==========> UTILS <==========
  public setAbaAtiva(titulo: string): void {
    const index = this.subMenus.findIndex(submenu => submenu.titulo == titulo);

    this.telasItem = this.subMenus[index].telasItem;
    this.listaAtiva = this.subMenus[index].titulo;

    this.onTituloSelecionado.emit(titulo);
  }
  // #endregion ==========> UTILS <==========

}
