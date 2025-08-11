import { Router } from "@angular/router";

export interface ICustomLoginService {
    
    // Propriedades Customizadas do Menu
    loginTitle: string;
    loginSubtitle: string;
    loginBackground: string;
    loginLogotipo: string;
    loginAltLogotipo: string;
    loginPageTitle: string;
    loginDesenvDomain: string;
    loginDesenvUser: string;
    loginDesenvPassword: string;

    // Métodos customizados do login
    authLogin(): void;

    authLogout(): void;

    authNavigateToPage(router: Router): void;
}