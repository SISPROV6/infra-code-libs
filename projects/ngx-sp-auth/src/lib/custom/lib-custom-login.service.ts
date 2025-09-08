import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ICustomLoginService } from './models/icustom-login-service';
import { LIB_CUSTOM_LOGIN_SERVICE } from './token';

@Injectable(
    { providedIn: 'root' }
)

export class LibCustomLoginService {
    
    constructor( 
        @Inject(LIB_CUSTOM_LOGIN_SERVICE) private _customLoginService: ICustomLoginService
    ) { }

  // #region Propriedade Customizadas para o Componente login.component.ts

  public get loginTitle(): string {
    return this._customLoginService.loginTitle;
  }

  public get loginSubtitle(): string {
    return this._customLoginService.loginSubtitle;
  }

  public get loginBackground(): string {
    return this._customLoginService.loginBackground;
  }

  public get loginLogotipo(): string {
    return this._customLoginService.loginLogotipo;
  }

  public get loginAltLogotipo(): string {
    return this._customLoginService.loginAltLogotipo;
  }

  public get loginPageTitle(): string {
    return this._customLoginService.loginPageTitle;
  }

  public get loginDesenvDomain(): string {
    return this._customLoginService.loginDesenvDomain;
  }

  public get loginDesenvUser(): string {
    return this._customLoginService.loginDesenvUser;
  }

  public get loginDesenvPassword(): string {
    return this._customLoginService.loginDesenvPassword;
  }

  // #endregion Propriedade Customizadas para o Componente login.component.ts

    // #region Métodos Customizadas para o Componente auth.service.ts

    /**
     * Método executado no auth.service.ts - método: login ()
     * Utilizado para inicializações diversas
     */
    public authLogin(): void {
        this._customLoginService.authLogin();
    }

    /**
     * Método executado no auth.service.ts - método: logout ()
     * Utilizado para inicializações diversas
     */
    public authLogout(): void {
      this._customLoginService.authLogout();
    }

    /**
     * Método executado no auth.service.ts - método: login ()
     * Utilizado para informar o redirecionamento para a tela inicial após o login ok
     * 
     * @param router Objeto de Router que será utilizado
     */
    public authNavigateToPage(router: Router): void {
      this._customLoginService.authNavigateToPage(router);
    }

    // #endregion Métodos Customizadas para o Componente auth.service.ts

}
