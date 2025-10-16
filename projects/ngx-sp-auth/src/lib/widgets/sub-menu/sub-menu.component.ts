import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentContainerComponent, LibIconsComponent } from 'ngx-sp-infra';
import { MenuServicesService } from '../../../public-api';
import { ProjectUtilservice } from '../../project/project-utils.service';
import { NavTabsComponent } from './nav-tabs/nav-tabs.component';

export class NavSubMenus {
  icon: string = '';
  titulo: string = '';
  subMenuItem: SubMenuItem[] = [];
}

export class SubMenuItem {
  titulo: string = '';
  telasItem: TelaItem[] = [];
}

export class TelaItem {
  titulo: string = '';
  urlPath: string = '';
  IsExternal:boolean = false;
}

@Component({
  selector: 'app-nav-sub-menu',
  imports: [
    NavTabsComponent,
    LibIconsComponent,
    ContentContainerComponent
  ],
  templateUrl: './sub-menu.component.html',
  styleUrl: './sub-menu.component.scss',
  standalone: true
})
export class SubMenuComponent implements OnInit {

  // #region ==========> PROPERTIES <==========

  // #region PUBLIC
  @Input() navSubmenus: NavSubMenus[] = [];
  @Input() isProduction: boolean = true;
  @Input() hostname: string = "https://siscandesv6.sispro.com.br";
  @Input() activeItem?: string;

  @Output() onTituloSelecionado: EventEmitter<string | null> = new EventEmitter<string | null>();
  @Output() onTelaSelecionada: EventEmitter<string | null> = new EventEmitter<string | null>();

  public hostNameOutSystems: string = "";
  public listaSubMenus: SubMenuItem[] = [];
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor(
    private _menuService: MenuServicesService,
    private _projectUtil: ProjectUtilservice
  ) { }

  ngOnInit(): void {
    this.getHostName();

    if (
      this.navSubmenus.length > 0 &&
      this.navSubmenus[0].subMenuItem &&
      this.navSubmenus[0].subMenuItem.length > 0
    ) {
      this.activeItem = this.navSubmenus[0].subMenuItem[0].titulo.toString();
    }

    this.listaFunction();
  }


  // #region ==========> UTILS <==========
  private listaFunction(): void {
    for(let i = 0; i < this.navSubmenus.length; i++) {
      this.listaSubMenus.push(...this.navSubmenus[i].subMenuItem);
    }
  }

  private getHostName(): void {
    this._menuService.GetHostServerOutSystems().subscribe({
      next: response => this.hostNameOutSystems = response.String,
      error: error => this._projectUtil.showHttpError(error)
    })
  }
  // #endregion ==========> UTILS <==========

}
