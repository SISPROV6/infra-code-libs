# NgxSpInfra - Biblioteca de funcionalidades e componentes 🚀
[![CI/CD](https://github.com/SISPROV6/infra-code-libs/actions/workflows/main.yml/badge.svg)](https://github.com/SISPROV6/infra-code-libs/actions/workflows/main.yml)
[![versão mais recente](https://badge.fury.io/js/ngx-sp-infra.svg)](//npmjs.com/package/ngx-sp-infra)
![downloads](https://img.shields.io/npm/dm/ngx-sp-infra.svg)

## Índice

- [Introdução](#introdução)
- [Uso](#uso)
- [Testes](#testes)
- [Publicação](#publicação)
  - [Manual](#manual)
  - [Automatizada](#automatizada)
- [Automatização de Publicação](#automatização-de-publicação)

## Introdução
Este projeto engloba funcionalidades genéricas da nossa infraestrutura como código (infra-as-code) que podem ser reutilizadas em outros projetos.

## Uso
Para usar a biblioteca em um projeto Angular, siga estas etapas:
1. Instalar a biblioteca - utilizando o comando  ```npm install ngx-sp-infra@latest --force``` _(O uso do --force é necessário por enquanto)_
2. Importar módulo - deve ter o InfraModule/ProjectModule nos imports do módulo/componente que está utilizando
```typescript
// Em uma estrutura de uma tela de Usuários, por exemplo
// No arquivo usuarios.module.ts:
@NgModule( {
   declarations: [
      // ...outros componentes
      PainelUsuariosComponent,
      FormularioUsuarioComponent
   ],
   imports: [
      // ...outros imports
      ProjectModule,
      UsuariosRoutingModule
   ],
   exports: [
         // ...
   ]
})
export class UsuariosModule { }
```
> [!IMPORTANT]
> Nunca importe ambos os módulos ProjectModule e InfraModule juntos!
> O InfraModule já está incluído dentro do ProjectModule, portanto, em projetos de Produtos, use apenas o ProjectModule.

## Testes
Antes de publicar a biblioteca para o NPM é muito importante realizar testes robustos do funcionamento da nova feature ou correção que foi realizada. Para realizar testes locais segue-se o seguinte passo-a-passo:

1. Com o projeto NgxSpInfra aberto em uma IDE execute o comando `ng build --watch`
2. No projeto que será usado para teste modifique o arquivo angular.json e adicione a propriedade "preserveSymlinks" dentro de `build > options` como no exemplo abaixo:
  ```json
    {
      // ...restante do conteúdo
      "build": {
      "builder": "@angular-devkit/build-angular:browser",
      "options": {
        "preserveSymlinks": true,
        // ...restante do conteúdo
      },
      // ...restante do conteúdo
    },
    }
  ```
3. Por fim, execute os dois comandos abaixo:
```bash
npm uninstall ngx-sp-infra --force
```
```bash
npm i "file:C:/SisproCloud/INFRA/Fontes/Sp_106_Imports/NgxSpInfra/dist/ngx-sp-infra"
```

> [!TIP]
> Se for necessário, utilize o `--force` ...principalmente no uninstall

E pronto! Agora graças ao `ng build --watch` sempre que uma alteração for salva no projeto NgxSpInfra os arquivos na dist irão se atualizar também e a instalação no projeto de teste observavará exatamente estes arquivos.

## Publicação
A publicação do pacote no NPM pode ser feita de forma manual ou automatizada.

#### Manual
Para a publicação manual (preferencialmente usando SVN ao invés de Git), siga estas etapas:
1. Executar o comando de build: No terminal, rode um dos seguintes comandos:
  - ```npm run build:patch``` _- incrementa uma versão PATCH (0.0.1) e faz o build_
  - ```npm run build:minor``` _- incrementa uma versão MINOR (0.1.0) e faz o build_
  - ```npm run build:major``` _- incrementa uma versão MAJOR (1.0.0) e faz o build_

2. O sistema deve perguntar ao usuário se ele deseja adicionar um sufixo à versão:
  - Para uma versão de teste, digite "test" ou "-test" e aperte ENTER
  - Para uma versão oficial, não é necessário digitar nada, apenas aperte ENTER

3. Logo depois, o sistema deve perguntar ao usuário se ele deseja realizar o commit da tag de versão, digite "N"

4. Independete das respostas anteriores, será feito um build da aplicação e por fim, o sistema deve perguntar ao usuário se ele deseja fazer um commit no repositório do GitHub, digite "N"

5. Publicar no NPM:
  - `cd dist/ngx-sp-infra`
  - `npm adduser` OU `npm login` _- depende se você já possui conta no NPM ou não_
  - `npm publish --access public --tag latest`

#### Automatizada
Para publicação automatizada (apenas quando utilizar git) devem ser seguidas as etapas abaixo:
1. Executar o comando de build: No terminal, rode um dos seguintes comandos:
  - ```npm run build:patch``` _- incrementa uma versão PATCH (0.0.1) e faz o build_
  - ```npm run build:minor``` _- incrementa uma versão MINOR (0.1.0) e faz o build_
  - ```npm run build:major``` _- incrementa uma versão MAJOR (1.0.0) e faz o build_

2. O sistema deve perguntar ao usuário se ele deseja adicionar um sufixo à versão:
  - Para uma versão de teste, digite "test" ou "-test" e aperte ENTER
  - Para uma versão oficial, não é necessário digitar nada, apenas aperte ENTER

3. Logo depois, o sistema deve perguntar ao usuário se ele deseja realizar o commit da tag de versão, digite "S" e pressione ENTER

4. Independete das respostas anteriores, será feito um build da aplicação e o sistema deve perguntar ao usuário se ele deseja fazer um commit no repositório do GitHub, digite "S" e pressione ENTER

5. Por fim o sistema perguntará ao usuário em que branch ele fará o commit, informe a branch correta (geralmente a atual) e pressione ENTER

> [!IMPORTANT]
> O deploy automático só será feito após commit nas branches `main`, `next` e `test`. Outras branches não realizarão o deploy para o NPM.

## Automatização de Publicação
A automatização da publicação é realizada utilizando GitHub Actions.

### Como funciona:
- Workflow: Um workflow específico é configurado para observar as branches main e test. Quando há um commit nessas branches, ele verifica as alterações e, caso o diretório dist tenha sido modificado, a ação de publicação no NPM é disparada automaticamente.
- Etapas: O workflow inclui etapas como a instalação de dependências, execução de builds, e a publicação no NPM. Tudo é gerenciado através de scripts e do token de autenticação NPM armazenado nos segredos do GitHub.
- Segurança: Apenas commits em branches específicas acionam a publicação, garantindo que somente código aprovado chegue ao NPM.

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