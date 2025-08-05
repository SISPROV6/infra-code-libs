import { CommonModule } from '@angular/common';
import { importProvidersFrom, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MsalGuard, MsalInterceptor, MsalModule } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './auth-config';

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

//??? Eliminar o que não precisa
@NgModule({
    providers: [
      importProvidersFrom(
                MsalModule.forRoot(new PublicClientApplication(msalConfig), 
          {
              // The routing guard configuration.
              interactionType: InteractionType.Redirect,
              authRequest: {
                  scopes: [
                      "user.read"
                  ]
              }
          }, 
          {
              // MSAL interceptor configuration.
              // The protected resource mapping maps your web API with the corresponding app scopes. If your code needs to call another web API, add the URI mapping here.
              interactionType: InteractionType.Redirect,
              protectedResourceMap: new Map([])
          }
  )),
  {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
  },
  MsalGuard, // MsalGuard added as provider here
  ],
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