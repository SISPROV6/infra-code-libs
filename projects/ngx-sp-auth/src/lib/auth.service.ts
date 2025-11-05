import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { Code2Fa } from './models/code-2fa';
import { ForgottenPasswordForm } from './models/forgotten-password-form';
import { InfraIn2FaTypeId } from './models/infraIn2FaTypeId';
import { InfraInAuthTypeId } from './models/infraInAuthTypeId';
import { Login } from './models/login';
import { LoginForm } from './models/login-form';
import { NovaSenhaForm } from './models/nova-senha-form';
import { PasswordRecup } from './models/password-recup';
import { Payload } from './models/payload';
import { RetAutenthication } from './models/ret-autenthication';
import { RetLogin } from './models/ret-login';

import { IpServiceService, RetError } from 'ngx-sp-infra';
import { LibCustomEnvironmentService } from './custom/lib-custom-environment.service';
import { LibCustomLoginService } from './custom/lib-custom-login.service';
import { ProjectUtilservice } from './project/project-utils.service';
import { IndexedDBService } from './services/indexed-db.service';
import { AuthStorageService } from './storage/auth-storage.service';
@Injectable(
  { providedIn: 'root' }
)

export class AuthService {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _pendingWarning: string | null = null;
  
  private readonly _BASE_URL: string = ''; // SpInfra2WS
  private readonly _AUTH_BASE_URL: string = ''; // SpInfra2AuthWS
  private readonly _BASE_OS_URL: string = ''; // SpInfra2LoginWS

  private readonly _HTTP_HEADERS = new HttpHeaders().set('Content-Type', 'application/json');
  private ip: string = "undefined";
  private city: string = "undefined";
  private state: string = "undefined";
  private country: string = "undefined";

  // #endregion PRIVATE

  // #endregion ==========> PROPERTIES <==========

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _authStorageService: AuthStorageService,
    private _ipServiceService: IpServiceService,
    private _customLoginService: LibCustomLoginService,
    private _projectUtilservice: ProjectUtilservice,
    private _customEnvironmentService: LibCustomEnvironmentService,
    private _indexedDBService: IndexedDBService
  ) {
    this._BASE_URL = `${ this._customEnvironmentService.SpInfra2LoginWS }/LoginSisproERP`; // SpInfra2WS
    this._AUTH_BASE_URL = `${ this._customEnvironmentService.SpInfra2AuthWS }/Auth`; // SpInfra2AuthWS
    this._BASE_OS_URL = `${ this._customEnvironmentService.SpInfra2LoginWS }/LoginIntegradoOS`; // SpInfra2LoginWS

    this._BASE_URL = !this._customEnvironmentService.production ? this._BASE_URL : `${ this._customEnvironmentService.SpInfra2LoginWS }/LoginSisproERP`;
    this._AUTH_BASE_URL = !this._customEnvironmentService.production ? this._AUTH_BASE_URL : `${ this._customEnvironmentService.SpInfra2AuthWS }/Auth`;
    this._BASE_OS_URL = !this._customEnvironmentService.production ? this._BASE_OS_URL : `${ this._customEnvironmentService.SpInfra2LoginWS }/LoginIntegradoOS`;

    this.getParms();
  }

  // #region ==========> SERVICE METHODS <==========

  // #region GET

  private getParms(): void {
    this.ip = "undefined";

    this._ipServiceService.getIPAddress().subscribe({
      next: (res: any) => {
        this.ip = res.ip;
      },
      error: (error: any) => {
      },
    });

    this.city = "undefined";
    this.state = "undefined";
    this.country = "undefined";

    this._ipServiceService.getDataUser().subscribe({
      next: (res: any) => {
        this.city = res.city;
        this.state = res.region_code;
        this.country = res.country_name;
      },
      error: (error: any) => {
      },
    });

  }

  private getHostName(): string {
    let product: string = window.location.pathname;

    let index: number = product.indexOf("/auth/login");

    if (index != -1) {
      product = product.substring(0, index);
    } else {
      product = "";
    }

    return this._projectUtilservice.getHostName() + product;   }

  // #endregion GET

  // #region POST

  /** Obtém o método de autenticação
  * @param domain Domínio do login
  * @returns Observable com os dados do método de autenticação, seja erro ou sucesso
  */
  public getAuthentication(domain: string): Observable<RetAutenthication> {
    
    const params = new HttpParams()
      .set('domain', domain)
  
    const url = `${ this._AUTH_BASE_URL }/GetAuthentication`;

    const headers = this._HTTP_HEADERS;
    
    return this._httpClient
      .post<RetAutenthication>(url, null ,  { 'params': params, 'headers': headers })
        .pipe(
          take(1),
          tap((response) => {

            if (response.Error) {
              throw Error(response.ErrorMessage);
            }
            
            localStorage.setItem('configServerUser', response.User);
            localStorage.setItem('configServerPassword', response.Password);

            this._authStorageService.tenantId = response.TenantId;
            this._authStorageService.dominio = response.Domain;
            this._authStorageService.infraInAuthTypeId = response.InfraInAuthTypeId;
            this._authStorageService.infraIn2FaTypeId = response.InfraIn2FaTypeId;
            this._authStorageService.is2FaEnabled = response.Is2FaEnabled;
            this._authStorageService.azureTenantId = response.AzureTenantId;
            this._authStorageService.azureClientId = response.AzureClientId;

            this._authStorageService.tokenPayload = {} as Payload;
          })
          
        );
  }

  /** Realiza o login no sistema
  * @param login Informações do formulário de login
  * @returns Observable com os dados do login realizado, seja erro ou sucesso
  */
  public login(domain: string, user: string, password: string): Observable<RetLogin> {
    
    let login: Login = {
      usuario: user,
      senha: password
    }

    const params = new HttpParams()

      .set('dominio', domain)
      .set('urlServidor', this.getHostName())
      .set('ip', this.ip)
      .set('browse', `${ this._ipServiceService.getDataBrowserUser().browser } - ${ this._ipServiceService.getDataBrowserUser().so }`)
      .set('localization', `${ this.city }, ${ this.state }, ${ this.country }`)
      .set('infraInAuthTypeId', this._authStorageService.infraInAuthTypeId)
      .set('infraIn2FaTypeId', this._authStorageService.infraIn2FaTypeId!)
      .set('is2FaEnabled', this._authStorageService.is2FaEnabled);

    const url = `${ this._BASE_URL }/ValidateLogin`;

    const headers = this._HTTP_HEADERS;

    return this._httpClient
      .post<RetLogin>(url, login,  { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap((response) => {

          // Limnpa o armazenamento local do navegador que contém os filtros de um produto específico (com base na prop 'product' do environment)
          this._indexedDBService.deleteDatabase();

          if (response.FeedbackMessage != "") {
            return;
          }

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

          if (response.InitializePassword) {
            //Inicializar password
            this._authStorageService.logout();

          } else if (this._authStorageService.infraInAuthTypeId == InfraInAuthTypeId.Local && this._authStorageService.infraIn2FaTypeId != null && this._authStorageService.infraIn2FaTypeId == InfraIn2FaTypeId.Email && this._authStorageService.is2FaEnabled) {
            //Inicializar Autenticação Local 2 Fatores via Email
            this._authStorageService.logout();

            this._authStorageService.ip = this.ip;
            this._authStorageService.tenantId = response.TenantId;
            this._authStorageService.infraUsuarioId = response.InfraUsuarioId;
            this._authStorageService.user = login.usuario;
            this._authStorageService.userName = response.UserName;
            this._authStorageService.dominio = response.Dominio;
            this._authStorageService.isExternalLogin = false;
            this._authStorageService.infraInAuthTypeId = InfraInAuthTypeId.Local;
            this._authStorageService.infraIn2FaTypeId = InfraIn2FaTypeId.Email;
            this._authStorageService.is2FaEnabled = true;
          } else {
            this._authStorageService.ignoreCheckLogin = true;

            this._authStorageService.isLoggedInSub.next(true);

            this._authStorageService.ip = this.ip;
            this._authStorageService.tenantId = response.TenantId;
            this._authStorageService.infraUsuarioId = response.InfraUsuarioId;
            this._authStorageService.infraEstabId = response.EstabelecimentoId;
            this._authStorageService.infraEstabNome = response.NomeEstabelecimento;
            this._authStorageService.infraEmpresaId = response.EmpresaId;
            this._authStorageService.infraEmpresaNome = response.NomeEmpresa;
            this._authStorageService.user = login.usuario;
            this._authStorageService.userName = response.UserName;
            this._authStorageService.authToken = response.Token;
            this._authStorageService.dominio = response.Dominio;
            this._authStorageService.isExternalLogin = false;

            // Método com customizações para inicializações do Login
            this._customLoginService.authLogin();

            if (this._authStorageService.urlRedirect == '' || this._authStorageService.urlRedirect == '/' || this._authStorageService.urlRedirect == '/auth/login') {
              // Método com customizações para redirecionamento da tela inicial após login ok
              this._customLoginService.authNavigateToPage(this._router);
            } else {
               this._router.navigate([this._authStorageService.urlRedirect]);
            }

            this._authStorageService.urlRedirect = "/";
          }

        })
      );
  }

  /** Realiza o login no sistema (Azure)
  * @param domain Domínio de login
  * @param user usuário de login (mail)
  * @returns Observable com os dados do login realizado, seja erro ou sucesso
  */
  public loginAzure(domain: string, user: string): Observable<RetLogin> {
  
  let login: Login = {
    usuario: user,
    senha: "azure"
  }

  const params = new HttpParams()

    .set('dominio', domain)
    .set('urlServidor', this.getHostName())
    .set('ip', this.ip)
    .set('browse', `${ this._ipServiceService.getDataBrowserUser().browser } - ${ this._ipServiceService.getDataBrowserUser().so }`)
    .set('localization', `${ this.city }, ${ this.state }, ${ this.country }`)
    .set('infraInAuthTypeId', this._authStorageService.infraInAuthTypeId)
    .set('infraIn2FaTypeId', this._authStorageService.infraIn2FaTypeId!)
    .set('is2FaEnabled', this._authStorageService.is2FaEnabled);

  const url = `${ this._BASE_URL }/ValidateLogin`;

  const headers = this._HTTP_HEADERS;
  
  return this._httpClient
    .post<RetLogin>(url, login,  { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap((response) => {

          if (response.FeedbackMessage != "") {
            return;
          }

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
          
          this._authStorageService.ignoreCheckLogin = true;
        
          this._authStorageService.isLoggedInSub.next(true);

          this._authStorageService.ip = this.ip;
          this._authStorageService.tenantId = response.TenantId;
          this._authStorageService.infraUsuarioId = response.InfraUsuarioId;
          this._authStorageService.infraEstabId = response.EstabelecimentoId;
          this._authStorageService.infraEstabNome = response.NomeEstabelecimento;
          this._authStorageService.infraEmpresaId = response.EmpresaId;
          this._authStorageService.infraEmpresaNome = response.NomeEmpresa;
          this._authStorageService.user = login.usuario;
          this._authStorageService.userName = response.UserName;
          this._authStorageService.authToken = response.Token;
          this._authStorageService.dominio = response.Dominio;
          this._authStorageService.isExternalLogin = false;
      
          // Método com customizações para inicializações do Login
          this._customLoginService.authLogin();

          if (this._authStorageService.urlRedirect == '' || this._authStorageService.urlRedirect == '/' || this._authStorageService.urlRedirect == '/auth/login') {
            // Método com customizações para redirecionamento da tela inicial após login ok
            this._customLoginService.authNavigateToPage(this._router);
          } else {
            this._router.navigate([this._authStorageService.urlRedirect]);
          }

          this._authStorageService.urlRedirect = "/";
        })
        
      );
  }

  public loginExternal(dominio: string, user: string, password: string): Observable<boolean> {

    let login: Login = {
      usuario: user,
      senha: password
    }

    const params = new HttpParams()
      .set('dominio', dominio);

    const url = `${this._BASE_URL}/ValidateExternalLogin`;

    const headers = this._HTTP_HEADERS;

    return this._httpClient
      .post<RetLogin>(url, login, { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap((response) => {

          if (!response.Error) {
            this._authStorageService.isLoggedInSub.next(true);

            this._authStorageService.ip = this.ip;
            this._authStorageService.tenantId = response.TenantId;
            this._authStorageService.infraUsuarioId = response.InfraUsuarioId;
            this._authStorageService.infraEstabId = response.EstabelecimentoId;
            this._authStorageService.infraEstabNome = response.NomeEstabelecimento;
            this._authStorageService.infraEmpresaId = response.EmpresaId;
            this._authStorageService.infraEmpresaNome = response.NomeEmpresa;
            this._authStorageService.user = login.usuario;
            this._authStorageService.userName = response.UserName;
            this._authStorageService.authToken = response.Token;
            this._authStorageService.dominio = response.Dominio;
            this._authStorageService.isExternalLogin = true;
          }

        }),
        map((response) => {
          return response.Error;
        }
        )

      );
  }

  /** Este método é utilizado para realizar o login no sistema integrado com a OS.
   * Originalmente pensado para utilizar apenas pelo componente de integração de login.
   * @param parmsLogin Informações do formulário de login
   * @param serialV6 Serial do V6
   * 
   * @returns Observable com os dados do login realizado, seja erro ou sucesso
  */
  public loginOS(parmsLogin: LoginForm, serialV6: string): Observable<RetLogin> {
    let login: Login = {
      usuario: parmsLogin.usuario,
      senha: parmsLogin.senha
    }

    const params = new HttpParams()
      .set('dominio', parmsLogin.dominio)
      .set('urlServidor', this.getHostName())
      .set('ip', this.ip)
      .set('browse', `${ this._ipServiceService.getDataBrowserUser().browser } - ${ this._ipServiceService.getDataBrowserUser().so }`)
      .set('localization', `${ this.city }, ${ this.state }, ${ this.country }`)
      .set('infraInAuthTypeId', this._authStorageService.infraInAuthTypeId)
      .set('infraIn2FaTypeId', this._authStorageService.infraIn2FaTypeId!)
      .set('is2FaEnabled', this._authStorageService.is2FaEnabled)
      .set('serialV6', serialV6);

    const url = `${ this._BASE_OS_URL }/ValidateOSLogin`;

    const headers = this._HTTP_HEADERS;
    
    return this._httpClient
      .post<RetLogin>(url, login, { 'params': params, 'headers': headers })
        .pipe(
          take(1),
          tap((response) => {if (response.FeedbackMessage != "" && response.FeedbackMessage != null) { return; }

            if (response.Error) {
              this._authStorageService.logout();
              throw Error(response.ErrorMessage);
            }
            
            if (response.InitializePassword) {
              //Inicializar password
              this._authStorageService.logout();
            }
            else if (this._authStorageService.infraInAuthTypeId == InfraInAuthTypeId.Local && this._authStorageService.infraIn2FaTypeId != null && this._authStorageService.infraIn2FaTypeId == InfraIn2FaTypeId.Email && this._authStorageService.is2FaEnabled) {
              //Inicializar Autenticação Local 2 Fatores via Email
              this._authStorageService.logout();

              this._authStorageService.ip = this.ip;
              this._authStorageService.tenantId = response.TenantId;
              this._authStorageService.infraUsuarioId = response.InfraUsuarioId;
              this._authStorageService.user = login.usuario;
              this._authStorageService.userName = response.UserName;
              this._authStorageService.dominio = response.Dominio;
              this._authStorageService.isExternalLogin = false;
            }
            else {
              this._authStorageService.ignoreCheckLogin = true;
            
              this._authStorageService.isLoggedInSub.next(true);
  
              this._authStorageService.ip = this.ip;
              this._authStorageService.tenantId = response.TenantId;
              this._authStorageService.infraUsuarioId = response.InfraUsuarioId;
              this._authStorageService.infraEstabId = response.EstabelecimentoId;
              this._authStorageService.infraEstabNome = response.NomeEstabelecimento;
              this._authStorageService.infraEmpresaId = response.EmpresaId;
              this._authStorageService.infraEmpresaNome = response.NomeEmpresa;
              this._authStorageService.user = login.usuario;
              this._authStorageService.userName = response.UserName;
              this._authStorageService.authToken = response.Token;
              this._authStorageService.dominio = response.Dominio;
              this._authStorageService.isExternalLogin = false;
            }
          })
        );
  }
  
  /** Realiza o logout do sistema, removendo tokens do localStorage e limpando cache */
  public logout() {
    this._authStorageService.logout();

    localStorage.removeItem('configsServerUser');
    localStorage.removeItem('configsServerPassword');

    // Método com customizações para inicializações do Logout
    this._customLoginService.authLogout();
    
    this._router.navigate(["/auth/login"]);
  }

  public validateAuthentication2Fa(code: string): Observable<RetLogin> {

    let Code2Fa: Code2Fa = {
      infraUsuarioId: this._authStorageService.infraUsuarioId,
      code: code
    }

    const params = new HttpParams()
      .set('domain', this._authStorageService.dominio)
      .set('user', this._authStorageService.user)
      .set('userName', this._authStorageService.userName)

    const url = `${this._BASE_URL}/ValidadeLogin2FaWithEmail`;

    const headers = this._HTTP_HEADERS;

    return this._httpClient
      .post<RetLogin>(url, Code2Fa, { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap((response) => {

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

          this._authStorageService.ignoreCheckLogin = true;

          this._authStorageService.isLoggedInSub.next(true);

          this._authStorageService.ip = this.ip;
          this._authStorageService.tenantId = response.TenantId;
          this._authStorageService.infraUsuarioId = response.InfraUsuarioId;
          this._authStorageService.infraEstabId = response.EstabelecimentoId;
          this._authStorageService.infraEstabNome = response.NomeEstabelecimento;
          this._authStorageService.infraEmpresaId = response.EmpresaId;
          this._authStorageService.infraEmpresaNome = response.NomeEmpresa;
          this._authStorageService.user = this._authStorageService.user;
          this._authStorageService.userName = response.UserName;
          this._authStorageService.authToken = response.Token;
          this._authStorageService.dominio = response.Dominio;
          this._authStorageService.isExternalLogin = false;

          // Método com customizações para inicializações do Login
          this._customLoginService.authLogin();

          if (this._authStorageService.urlRedirect == '' || this._authStorageService.urlRedirect == '/' || this._authStorageService.urlRedirect == '/auth/login') {
            // Método com customizações para redirecionamento da tela inicial após login ok
            this._customLoginService.authNavigateToPage(this._router);
          } else {
            this._router.navigate([this._authStorageService.urlRedirect]);
          }

          this._authStorageService.urlRedirect = "/";
        })

      );
  }

  public GetNewCode2Fa(): Observable<RetError> {

    const params = new HttpParams()
      .set('domain', this._authStorageService.dominio)
      .set('user', this._authStorageService.user)
      .set('ip', this.ip)
      .set('browse', `${this._ipServiceService.getDataBrowserUser().browser} - ${this._ipServiceService.getDataBrowserUser().so}`)
      .set('localization', `${this.city}, ${this.state}, ${this.country}`);

    const url = `${this._BASE_URL}/GetNewCode2FaWithEmail`;

    const headers = this._HTTP_HEADERS;

    return this._httpClient
      .post<RetLogin>(url, null, { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap((response) => {

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

        })

      );
  }

  public forgottenPassword(parms: ForgottenPasswordForm): Observable<RetError> {

    this._authStorageService.logout();

    const params = new HttpParams()
      .set('domain', parms.dominioFgtPsw)
      .set('user', parms.usuarioFgtPsw)
      .set('urlServidor', this.getHostName())
      .set('ip', this.ip)
      .set('browse', `${this._ipServiceService.getDataBrowserUser().browser} - ${this._ipServiceService.getDataBrowserUser().so}`)
      .set('localization', `${this.city}, ${this.state}, ${this.country}`);

    const headers = this._HTTP_HEADERS;

    const url = `${this._BASE_URL}/ForgottenPassword`;

    return this._httpClient
      .post<RetError>(url, null, { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap((response) => {

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

        })

      );

  }

  public recoverPassword(dominio: string, usuario: string, parms: NovaSenhaForm): Observable<RetError> {

    let recupPassword: PasswordRecup = {
      password: parms.password,
      confirmPassword: parms.confirmPassword,
      code: parms.code
    }

    const params = new HttpParams()
      .set('domain', dominio)
      .set('user', usuario)

    const headers = this._HTTP_HEADERS;

    const url = `${this._BASE_URL}/RecoverPassword`;

    return this._httpClient
      .post<RetError>(url, recupPassword, { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap((response) => {

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

        })

      );

  }

  public createPassword(dominio: string, usuario: string, parms: NovaSenhaForm): Observable<RetError> {

    let recupPassword: PasswordRecup = {
      password: parms.password,
      confirmPassword: parms.confirmPassword,
      code: parms.code
    }

    const params = new HttpParams()
      .set('domain', dominio)
      .set('user', usuario)

    const headers = this._HTTP_HEADERS;

    const url = `${this._BASE_URL}/CreatePassword`;

    return this._httpClient
      .post<RetError>(url, recupPassword, { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap((response) => {

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

        })
      );
  }

  // #endregion POST

  // #endregion ==========> SERVICE METHODS <==========

  // #region ==========> UTILS <==========
  public setPendingWarning(message: string) {
    this._pendingWarning = message;
  }

  public consumePendingWarning(): string | null {
    const message = this._pendingWarning;
    this._pendingWarning = null;

    return message;
  }

  // #endregion ==========> UTILS <==========

}
