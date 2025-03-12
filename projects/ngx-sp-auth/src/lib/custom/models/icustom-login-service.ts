
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
    // Métodos do Menu
    authLogin(): void;
    authLogout(): void;
}