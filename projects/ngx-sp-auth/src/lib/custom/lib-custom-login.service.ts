import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ICustomLoginService } from './models/icustom-login-service';

@Injectable(
    { providedIn: 'root' }
)
export class LibCustomLoginService {
    constructor() { }

    // #region Propriedade Customizadas para o Componente login.component.ts

    public loginTitle: string = "";
    public loginSubtitle: string = "";
    public loginBackground: string = "";
    public loginLogotipo: string = "";
    public loginAltLogotipo: string = "";
    public loginPageTitle: string = "";
    public loginDesenvDomain: string = "";
    public loginDesenvUser: string = "";
    public loginDesenvPassword: string = "";

    // #endregion Propriedade Customizadas para o Componente login.component.ts

    // #region Métodos Customizadas para o Componente auth.service.ts

    /**
     * Método executado no auth.service.ts - método: login ()
     * Utilizado para inicializações diversas
     */
    public authLogin(): void {
        this.storedAuthLogin();
    }

    /**
     * Método executado no auth.service.ts - método: logout ()
     * Utilizado para inicializações diversas
     */
    public authLogout(): void {
        this.storedAuthLogout();
    }

    /**
     * Método executado no auth.service.ts - método: login ()
     * Utilizado para informar o redirecionamento para a tela inicial após o login ok
     * 
     * @param router Objeto de Router que será utilizado
     */
    public authNavigateToPage(router: Router): void {
      this.storedAuthNavigateToPage(router);
    }
    // #endregion Métodos Customizadas para o Componente auth.service.ts

    // #region Métodos recebidos do projeto

    public storedAuthLogin!: () => void;

    public storedAuthLogout!: () => void;

    public storedAuthNavigateToPage!: (router: Router) => void;

    // #endregion Métodos recebidos do projeto

    // #region Métodos Publicos

    public ConfigurarCustomLogin(customLoginService: ICustomLoginService): void {

        //passando propriedades do projeto para a lib
        this.loginTitle = customLoginService.loginTitle;
        this.loginSubtitle = customLoginService.loginSubtitle;
        this.loginBackground = customLoginService.loginBackground;
        this.loginLogotipo = customLoginService.loginLogotipo;
        this.loginAltLogotipo = customLoginService.loginAltLogotipo;
        this.loginPageTitle = customLoginService.loginPageTitle;
        this.loginDesenvDomain = customLoginService.loginDesenvDomain;
        this.loginDesenvUser = customLoginService.loginDesenvUser;
        this.loginDesenvPassword = customLoginService.loginDesenvPassword;

        //passando implementação dos métodos do projeto para a lib
        this.storedAuthLogin = customLoginService.authLogin;

        this.storedAuthLogout = customLoginService.authLogout;

        this.storedAuthNavigateToPage = customLoginService.authNavigateToPage;
    }

   // #endregion Métodos Publicos
    
}
