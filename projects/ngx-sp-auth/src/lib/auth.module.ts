import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfraModule } from 'ngx-sp-infra';
import { LoginComponent } from '../lib/components/login/login.component';
import { PrimaryDropdownComponent } from '../lib/components/menu-lateral/dropdown/primary-dropdown/primary-dropdown.component';
import { SecondaryDropdownComponent } from '../lib/components/menu-lateral/dropdown/secondary-dropdown/secondary-dropdown.component';
import { MenuLateralComponent } from '../lib/components/menu-lateral/menu/menu-lateral.component';
import { SelecaoEstabelecimentosModalComponent } from '../lib/components/menu-lateral/menu/selecao-estabelecimentos-modal/selecao-estabelecimentos-modal.component';
import { DynamicMenuComponent } from '../lib/components/menu-lateral/submenus/dynamic-menu/dynamic-menu.component';
import { NotifSubmenuComponent } from '../lib/components/menu-lateral/submenus/notif-submenu/notif-submenu.component';
import { NovaSenhaComponent } from '../lib/components/nova-senha/nova-senhacomponent';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InfraModule,
    NgxPaginationModule,
    PopoverModule,
    TooltipModule,
    CommonModule,
    RouterLink,
    RouterOutlet
  ],
  exports: [
    LoginComponent,
  ]
})
export class AuthModule { }