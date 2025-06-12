import { Component, Input, OnInit } from '@angular/core';
// import { InfraModule } from 'ngx-sp-infra';
// import { NavTabsComponent } from './nav-tabs/nav-tabs.component';
import { ContentContainerComponent } from '../content-container/content-container.component';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';
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
  
  @Input() navSubmenus: NavSubMenus[] = [];
  
  @Input() isProduction: boolean = true;
  
  @Input() hostname: string = "https://siscandesv6.sispro.com.br";
  
  activeItem: string = '';

  listaSubMenus: SubMenuItem[] = [];

  ngOnInit(): void {
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

}
