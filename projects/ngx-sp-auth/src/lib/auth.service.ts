import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';


import { Code2Fa } from './models/code-2fa';
import { ForgottenPasswordForm } from './models/forgotten-password-form';
import { Login } from './models/login';
import { LoginForm } from './models/login-form';
import { NovaSenhaForm } from './models/nova-senha-form';
import { PasswordRecup } from './models/password-recup';
import { RetLogin } from './models/ret-login';

import { IpServiceService, RetError } from 'ngx-sp-infra';
import { AuthStorageService } from './storage/auth-storage.service';

@Injectable(
  { providedIn: 'root' }
)

export class AuthService {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE

  private readonly _HOSTNAME: any = window.location.hostname.includes("localhost")
    ? `http://${window.location.hostname}`
    : `https://${window.location.hostname}`;

  private readonly _BASE_URL: string = `${this._HOSTNAME}/SisproErpCloud/Service_Private/Infra/SpInfra2LoginWS/api/LoginSisproERP`; // SpInfra2WS
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
  ) {
    //this._BASE_URL = !environment.production ? this._BASE_URL : `${environment.SpInfra2LoginWS}/LoginSisproERP`;

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

  private geHostName(): string {
    let product: string = window.location.pathname;

    let index: number = product.indexOf("/auth/login");

    if (index != -1) {
      product = product.substring(0, index);
    } else {
      product = "";
    }

    return this._HOSTNAME + product;
  }

  // #endregion GET

  // #region POST

  /** Realiza o login no sistema
  * @param login Informações do formulário de login
  * @returns Observable com os dados do login realizado, seja erro ou sucesso
  */
  public login(parmsLogin: LoginForm): Observable<RetLogin> {

    let login: Login = {
      usuario: parmsLogin.usuario,
      senha: parmsLogin.senha
    }

    const params = new HttpParams()

      .set('dominio', parmsLogin.dominio)
      .set('urlServidor', this.geHostName())
      .set('ip', this.ip)
      .set('browse', `${this._ipServiceService.getDataBrowserUser().browser} - ${this._ipServiceService.getDataBrowserUser().so}`)
      .set('localization', `${this.city}, ${this.state}, ${this.country}`);

    const url = `${this._BASE_URL}/ValidateLogin`;

    const headers = this._HTTP_HEADERS;

    return this._httpClient
      .post<RetLogin>(url, login, { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap((response) => {

          if (response.FeedbackMessage != "") {
            return;
          }

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

          if (response.InitializePassword) {
            //Inicializar password
            this._authStorageService.logout();

          } else if (response.InfraInAuthTypeId == 1 && response.InfraIn2FaTypeId != null && response.InfraIn2FaTypeId == 1 && response.Is2FaEnabled) {
            //Inicializar Autenticação Local 2 Fatores via Email
            this._authStorageService.logout();

            this._authStorageService.ip = this.ip;
            this._authStorageService.tenantId = response.TenantId;
            this._authStorageService.infraUsuarioId = response.InfraUsuarioId;
            this._authStorageService.user = login.usuario;
            this._authStorageService.userName = response.UserName;
            this._authStorageService.dominio = response.Dominio;
            this._authStorageService.isExternalLogin = false;

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
            this.authLogin();

            if (this._authStorageService.urlRedirect == '' || this._authStorageService.urlRedirect == '/' || this._authStorageService.urlRedirect == '/auth/login') {
              // Método com customizações para redirecionamento da tela inicial após login ok
              this.authNavigateToPage(this._router);
            } else {
              this._router.navigate([this._authStorageService.urlRedirect]);
            }

            this._authStorageService.urlRedirect = "/";
          }

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

  public logout() {
    this._authStorageService.logout();

    localStorage.removeItem('configsServerUser');
    localStorage.removeItem('configsServerPassword');

    // Método com customizações para inicializações do Logout
    this.authLogout();

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
          this.authLogin();

          if (this._authStorageService.urlRedirect == '' || this._authStorageService.urlRedirect == '/' || this._authStorageService.urlRedirect == '/auth/login') {
            // Método com customizações para redirecionamento da tela inicial após login ok
            this.authNavigateToPage(this._router);
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
      .set('urlServidor', this.geHostName())
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


  /** Propriedades e Métodos que recebem valores do custom login service **/

  public authLogin(callback?: () => void): void {
    if (callback) {
      callback();
    }
  }

  public authLogout(callback?: () => void): void {
    if (callback) {
      callback();
    }
  }

  public authNavigateToPage(router: Router, callback?: (router: Router) => void): void {
    if (callback) {
      callback(router);
    } else {
      router.navigate(["/home"]);
    }
  }

  // #endregion ==========> UTILS <==========
}
