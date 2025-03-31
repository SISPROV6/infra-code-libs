# NgxSpAuth - Biblioteca de Login 🔐
 
![npm version](https://img.shields.io/npm/v/ngx-sp-auth)

![npm downloads](https://img.shields.io/npm/dt/ngx-sp-auth)
 
# Introdução 📝
 
Esta biblioteca fornece componentes de telas relacionadas a autenticação.
 
# Recursos 🚀
 
✅ Autenticação de usuários com tenant, usuario e senha;

✅ Recuperação de senha;

✅ Menu Lateral liberado após Login.
 
# Instalação e configuração 📥
 
1️⃣ Instalar a biblioteca - utilizando o comando  "npm install ngx-sp-auth";
 
2️⃣ Configurar o sistema para utilizar os componentes (somente para projetos que nunca utilizaram essa biblioteca);
 
2.1. Substituir referência do import { AuthStorageService } from 'src/app/auth/storage/auth-storage.service'
para import { AuthStorageService } from 'ngx-sp-auth';
 
2.2. Verificar se existe mais alguma referência para algum arquivo dentro do diretório "src/app/auth/" e substitua a importação para "ngx-sp-auth",
isso depende de cada projeto.
 
2.3. Adicionar/Alterar os seguintes trechos de código do projeto.
 
- import { AuthGuard, LoginComponent, NovaSenhaComponent } from "ngx-sp-auth";
 
- No seu APP_ROUTES colocar as rotas abaixo.
 
```typescript
    {
        path: "auth/login",
        component: LoginComponent,
        canLoad: [LoginGuard]
    },
    {
        path: 'auth/login/novaSenha/:param',
        component: NovaSenhaComponent,
        canLoad: [LoginGuard]
    }
```
 
  - No seu app-component.ts adicionar o seguinte código abaixo.
    (Serve principalmente para adicionar propriedades e métodos customizados ou não para a biblioteca).
 
```typescript
  import { AuthStorageService, EnvironmentService, ICustomLoginService, ICustomMenuService, ICustomStorageService, IEnvironments, IMenuConfig, LibCustomLoginService, LibCustomMenuService, LibCustomStorageService, MenuConfigService } from 'ngx-sp-auth';
  import { CustomMenuService } from './project/custom/menu/custom-menu.service';
  import { CustomLoginService } from './project/custom/login/custom-login.service';
  import { CustomStorageService } from './project/custom/storage/custom-storage.service';
 
  export class AppComponent {
 
      private _menuConfig = new MenuConfig(false);
 
      public configCustomLogin: ICustomLoginService = {
            // passando propriedades customizadas para o componente de Login
            loginTitle: "",
            loginSubtitle: "",
            loginBackground: "",
            loginLogotipo: "",
            loginAltLogotipo: "",
            loginPageTitle: "",
            loginDesenvDomain: "",
            loginDesenvUser: "",
            loginDesenvPassword: "",
            // passando métodos customizados para o componente de Login
            authLogin: (): void => { },
            authLogout: (): void => { }
      }
 
      public mapsEnvironment: IEnvironments = {
            needsAuthAplic: environment.needsAuthAplic,
            needsAuthInfra: environment.needsAuthInfra
      };
 
      public configMenuProduto: IMenuConfig = {
            isMenuStatic: this._menuConfig._isMenuStatic,
            initializeMenu: this._menuConfig.initializeMenu,
            menuOptions: this._menuConfig.menuOptions,
            initializeMenuDropdown: this._menuConfig.initializeMenuDropdown
      }
 
      public configCustomMenuService: ICustomMenuService = {
            menuDynamic: false,
            moduleName: '',
            moduleImg: '',
            moduleSvg: "",
            themeColor: "",
            menuDynamicOnInit: (): void => { },
            menuStaticOnInit: (): void => { },
            menuopenExpansibleMenu: (ref: HTMLDivElement): void => { },
      };
 
      public configCustomStorageService: ICustomStorageService = {
            isSaving: false,
            storageConstructor: (): void => { },
            storageLogout: (): void => { },
            storageSaveLocalInstance: (): void => { },
            storageInitializeAutoStorage: (): void => { }
      };
 
      constructor(
            private _environmentService: EnvironmentService,
            private _menuConfigService: MenuConfigService,
            private _customMenuService: CustomMenuService,
            private _customLoginService: CustomLoginService,
            private _customStorageService: CustomStorageService,
            private _libCusomLoginService: LibCustomLoginService,
            private _libCustomMenuService: LibCustomMenuService,
            private _libCustomStorageService: LibCustomStorageService,
      ) {
 
            this.configCustomMenuService.menuDynamic = this._customMenuService.menuDynamic;
            this.configCustomMenuService.moduleName = this._customMenuService.moduleName;
            this.configCustomMenuService.moduleImg = this._customMenuService.moduleImg;
            this.configCustomMenuService.moduleSvg = this._customMenuService.moduleSvg;
            this.configCustomMenuService.themeColor = this._customMenuService.themeColor;
 
            this.configCustomStorageService.storageConstructor = this._customStorageService.storageConstructor;
            this.configCustomStorageService.storageInitializeAutoStorage = this._customStorageService.storageInitializeAutoStorage;
            this.configCustomStorageService.storageLogout = this._customStorageService.storageLogout;
            this.configCustomStorageService.storageSaveLocalInstance = this._customStorageService.storageSaveLocalInstance;
 
            this.configCustomLogin.loginAltLogotipo = this._customLoginService.loginAltLogotipo;
            this.configCustomLogin.loginTitle = this._customLoginService.loginTitle;
            this.configCustomLogin.loginSubtitle = this._customLoginService.loginSubtitle;
            this.configCustomLogin.loginPageTitle = this._customLoginService.loginPageTitle;
            this.configCustomLogin.loginLogotipo = this._customLoginService.loginLogotipo;
            this.configCustomLogin.loginDesenvUser = this._customLoginService.loginDesenvUser;
            this.configCustomLogin.loginDesenvDomain = this._customLoginService.loginDesenvDomain;
            this.configCustomLogin.loginDesenvPassword = this._customLoginService.loginDesenvPassword;
            this.configCustomLogin.loginBackground = this._customLoginService.loginBackground;
            this.configCustomLogin.authLogin = this._customLoginService.authLogin;
            this.configCustomLogin.authLogout = this._customLoginService.authLogout;
 
            this.configCustomMenuService.menuDynamicOnInit = this._customMenuService.menuDynamicOnInit;
            this.configCustomMenuService.menuStaticOnInit = this._customMenuService.menuStaticOnInit;
            this.configCustomMenuService.menuopenExpansibleMenu = this._customMenuService.menuopenExpansibleMenu;
 
            _libCustomStorageService.ConfigurarCustomStorage(this.configCustomStorageService);
            _libCusomLoginService.ConfigurarCustomLogin(this.configCustomLogin);
            _environmentService.ConfigurarEnvironments(this.mapsEnvironment);
            _menuConfigService.ConfigurarMenuConfig(this.configMenuProduto);
            _libCustomMenuService.ConfigurarCustomMenuService(this.configCustomMenuService);
      }
  }
```
 
- Remover o AUTH_ROUTES do main.ts
 
Antes:
```typescript
   provideRouter([
            ...APP_ROUTES,
            ...PROJECT_ROUTES,
            ...AUTH_ROUTES
        ]),
 
```
Depois:
 
```typescript
   provideRouter([
            ...APP_ROUTES,
            ...PROJECT_ROUTES,
        ]),
```

- Verificar o hostname do environments.ts, mudar tudo para minúsculo se tiver algo escrito em maiúsculo.
 
# Customização de Estilos (SCSS) 🎨
 
Para realizar as customizações de SCSS na biblioteca é necessario implementar o código nos seguintes arquivos do seu projeto.
 
- custom-login-styles.scss
- custom-menu-styles.scss
- custom-styles.scss
 
Classes possiveis de estilização no componente de Login:
 
```typescript
//Ainda sendo validado.
```
 
# Publicar no NPM 🚀
 
1️⃣ Mudar a propriedade "version" do no package.json para o número da nova versão que se deseja publicar no NPM.
 
  nova versão PATCH (0.0.1);

  nova versão MINOR (0.1.0);

  nova versão MAJOR (1.0.0) *Somente para grandes mudanças biblioteca*.
 
2️⃣ Comandos para publicação:
 
  - `cd dist/ngx-sp-auth`
  - `npm adduser` OU `npm login` _- depende se você já possui conta no NPM ou não_
  - `npm publish --access public --tag latest`