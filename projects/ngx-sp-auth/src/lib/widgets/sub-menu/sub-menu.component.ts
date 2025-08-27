import { Component, Input, OnInit } from '@angular/core';
import { NavTabsComponent } from './nav-tabs/nav-tabs.component';
import { ContentContainerComponent, LibIconsComponent } from 'ngx-sp-infra';
import { MenuServicesService } from '../../../public-api';
import { ProjectUtilservice } from '../../project/project-utils.service';

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

/**
 *
 */
constructor(private _menuService:MenuServicesService, private _projectUtil:ProjectUtilservice) {
}

  @Input() navSubmenus: NavSubMenus[] = [];

  @Input() isProduction: boolean = true;

  @Input() hostname: string = "https://siscandesv6.sispro.com.br";

  public hostNameOutSystems:string = "";

  activeItem: string = '';

  listaSubMenus: SubMenuItem[] = [];


  ngOnInit(): void {
    this.GetHostName();
    if (
      this.navSubmenus.length > 0 &&
      this.navSubmenus[0].subMenuItem &&
      this.navSubmenus[0].subMenuItem.length > 0
    ) {
      this.activeItem = this.navSubmenus[0].subMenuItem[0].titulo.toString();
    }
    this.listaFunction();
  }

  listaFunction(){
    for(let i = 0; i < this.navSubmenus.length; i++){
      this.listaSubMenus.push(...this.navSubmenus[i].subMenuItem);
    }
  }


  public GetHostName(){
    this._menuService.GetHostServerOutSystems().subscribe({
      next:response => {
        console.log(response.String)
        this.hostNameOutSystems = response.String
      },
      error:error=> this._projectUtil.showHttpError(error)
    })
  }

}
