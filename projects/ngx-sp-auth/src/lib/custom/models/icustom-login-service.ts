import { Router } from "@angular/router";

export interface ICustomLoginService {
    
    // Propriedades Customizadas do Menu
    get loginTitle(): string;

    get loginSubtitle(): string;

    get loginBackground(): string;

    get loginLogotipo(): string;

    get loginAltLogotipo(): string;

    get loginPageTitle(): string;

    get loginDesenvDomain(): string;

    get loginDesenvUser(): string;
    
    get loginDesenvPassword(): string;

    // Métodos customizados do login
    authLogin(): void;

    authLogout(): void;

    authNavigateToPage(router: Router): void;
}