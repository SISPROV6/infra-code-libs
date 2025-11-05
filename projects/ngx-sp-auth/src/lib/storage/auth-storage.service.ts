import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { Payload } from './../models/payload';

import { Utils } from 'ngx-sp-infra';
import { LibCustomEnvironmentService } from '../custom/lib-custom-environment.service';
import { LibCustomStorageService } from '../custom/lib-custom-storage.service';
import { RetToken } from '../models/ret-token';
import { Token } from '../models/token';
import { IndexedDBService } from '../services/indexed-db.service';

@Injectable(
  { providedIn: 'root' }
)
export class AuthStorageService {
  
  private readonly _BASE_URL: string = ''; // SpInfra2WS

  private readonly __local_key = 'user_auth_v6';

  // indica se objeto já está marcado para salvar os dados no local storage.
  private __isSaving: boolean = false;

  /** Se ainda estamos com uma função rodando para verificar o login do usuário */
  private __isCheckingAuth: boolean = false;

  /* Variável para contornar o erro >>> NG0200: Circular dependency" */
  private _httpClient: HttpClient;

  constructor(
    private _httpBackend: HttpBackend,
    private _customStorageService: LibCustomStorageService,
    private _indexedDBService: IndexedDBService,
    private _customEnvironmentService: LibCustomEnvironmentService
  ) {
    this._httpClient = new HttpClient(_httpBackend);
 
    this._BASE_URL = `${ _customEnvironmentService.SpInfra2LoginWS }/LoginSisproERP`; // SpInfra2WS

    this._BASE_URL = !_customEnvironmentService.production ? this._BASE_URL : `${_customEnvironmentService.SpInfra2LoginWS}/LoginSisproERP`;

    // Método com customizações para inicializações da storage
    this._customStorageService.storageConstructor()

    const expectedLocalAuthStorage = localStorage.getItem(this.__local_key);

    if (expectedLocalAuthStorage) {
      const localAuthStorage = JSON.parse(expectedLocalAuthStorage) as AuthStorageService;

      try {
        this.__ip = localAuthStorage.__ip;
        this.__tenantId = localAuthStorage.__tenantId;
        this.__infraUsuarioId = localAuthStorage.__infraUsuarioId;
        this.__infraEstabId = localAuthStorage.__infraEstabId;
        this.__infraEstabNome = localAuthStorage.__infraEstabNome;
        this.__infraEmpresaId = localAuthStorage.__infraEmpresaId;
        this.__infraEmpresaNome = localAuthStorage.__infraEmpresaNome;
        this.__user = localAuthStorage.__user;
        this.__userName = localAuthStorage.__userName;
        this.__tokenPayload = localAuthStorage.__tokenPayload;
        this.__authToken = localAuthStorage.__authToken;
        this.__dominio = localAuthStorage.__dominio;
        this.__isExternalLogin = localAuthStorage.__isExternalLogin;
        this.__infraInAuthTypeId = localAuthStorage.__infraInAuthTypeId;
        this.__infraIn2FaTypeId = localAuthStorage.__infraIn2FaTypeId;
        this.__is2FaEnabled = localAuthStorage.__is2FaEnabled;
        this.__azureTenantId = localAuthStorage.__azureTenantId;
        this.__azureClientId = localAuthStorage.__azureClientId;

        this.startLoginCheck();
      } catch (error) {
        this.logout();

        return;
      }

    }

  }

  // #region GETTERS/SETTERS

  public isLoggedInSub = new BehaviorSubject<boolean>(false);

  //ip
  private __ip: string = "";

  public get ip(): string {
    return this.__ip;
  }

  public set ip(value: string) {
    this.__ip = value;

    if (this.isLoggedInSub.value) {
      this.__saveLocalInstance();
    }

  }

  //tenantId
  private __tenantId: number = 0;

  public get tenantId(): number {
    return this.__tenantId;
  }

  public set tenantId(value: number) {
    this.__tenantId = value;

    this.__saveLocalInstance();
  }

  //infraUsuarioId
  private __infraUsuarioId: string = "";

  public get infraUsuarioId(): string {
    return this.__infraUsuarioId;
  }

  public set infraUsuarioId(value: string) {
    this.__infraUsuarioId = value;

    this.__saveLocalInstance();
  }

  // EstabelecimentoID
  private __infraEstabId: string = "";

  public get infraEstabId(): string {
    return this.__infraEstabId;
  }

  public set infraEstabId(value: string) {
    this.__infraEstabId = value;

    this.__saveLocalInstance();
  }

  // NomeEstabelecimento
  private __infraEstabNome: string = "";

  public get infraEstabNome(): string {
    return this.__infraEstabNome;
  }

  public set infraEstabNome(value: string) {
    this.__infraEstabNome = value;

    this.__saveLocalInstance();
  }

  // EmpresaID
  private __infraEmpresaId: string = "";

  public get infraEmpresaId(): string {
    return this.__infraEmpresaId;
  }

  public set infraEmpresaId(value: string) {
    this.__infraEmpresaId = value;

    this.__saveLocalInstance();
  }

  // NomeEmpresa
  private __infraEmpresaNome: string = "";

  public get infraEmpresaNome(): string {
    return this.__infraEmpresaNome;
  }

  public set infraEmpresaNome(value: string) {
    this.__infraEmpresaNome = value;

    this.__saveLocalInstance();
  }

  //user
  private __user: string = "";

  public get user(): string {
    return this.__user;
  }

  public set user(value: string) {
    this.__user = value;

    this.__saveLocalInstance();
  }

  //username
  private __userName: string = "";

  public get userName(): string {
    return this.__userName;
  }

  public set userName(value: string) {
    this.__userName = value;

    this.__saveLocalInstance();
  }

  //tokenPayload
  private __tokenPayload!: Payload;

  public get tokenPayload(): Payload {
    return this.__tokenPayload;
  }

  public set tokenPayload(value: Payload) {
    this.__tokenPayload = value;

    this.__saveLocalInstance();
  }

  //authToken
  private __authToken: string = "";

  public get authToken(): string {
    return this.__authToken;
  }

  public set authToken(value: string) {
    this.__authToken = value;

    if (this.__authToken != '') {
      // Utiliza-se a função dos Utils para pegar o segundo valor do Token, separados por um '.'
      // e define o __tokenPayload como o objeto resultante do JSON.parse(payloadJson)
      const payloadJson: string = Utils.b64DecodeUnicode(this.__authToken.split('.')[1]);

      this.__tokenPayload = JSON.parse(payloadJson);

      this.startLoginCheck();
    }

    this.__saveLocalInstance();
  }

  /** Domínio */
  private __dominio: string = "";

  public get dominio(): string {
    return this.__dominio;
  }

  public set dominio(value: string) {
    this.__dominio = value;

    this.__saveLocalInstance();
  }

  //url para redirecionamento
  private __UrlRedirect: string = "/";

  public get urlRedirect(): string {
    return this.__UrlRedirect;
  }

  public set urlRedirect(value: string) {
    this.__UrlRedirect = value;
  }

  //indica Login Externo
  private __isExternalLogin: boolean = false;

  public get isExternalLogin(): boolean {
    return this.__isExternalLogin;
  }

  public set isExternalLogin(value: boolean) {
    this.__isExternalLogin = value;

    this.__saveLocalInstance();
  }

  /** Se é para ignorar o método reCheckLogin */
  private __ignoreCheckLogin: boolean = false;

  public get ignoreCheckLogin(): boolean {
    return this.__ignoreCheckLogin;
  }

  public set ignoreCheckLogin(value: boolean) {
    this.__ignoreCheckLogin = value;

    this.__saveLocalInstance();
  }

  //infraInAuthTypeId
  private __infraInAuthTypeId: number = 0;

  public get infraInAuthTypeId(): number {
    return this.__infraInAuthTypeId;
  }

  public set infraInAuthTypeId(value: number) {
    this.__infraInAuthTypeId = value;

    this.__saveLocalInstance();
  }

  //infraIn2FaTypeId
  private __infraIn2FaTypeId: number | null | undefined = null;

  public get infraIn2FaTypeId(): number | null | undefined {
    return this.__infraIn2FaTypeId;
  }

  public set infraIn2FaTypeId(value: number | null | undefined) {
    this.__infraIn2FaTypeId = value;

    this.__saveLocalInstance();
  }

  //is2FaEnabled
  private __is2FaEnabled: boolean = false;

  public get is2FaEnabled(): boolean {
    return this.__is2FaEnabled;
  }

  public set is2FaEnabled(value: boolean) {
    this.__is2FaEnabled = value;

    this.__saveLocalInstance();
  }

  // azureTenantId
  private __azureTenantId: string = "";

  public get azureTenantId(): string {
    return this.__azureTenantId;
  }

  public set azureTenantId(value: string) {
    this.__azureTenantId = value;

    this.__saveLocalInstance();
  }

  // azureClientId
  private __azureClientId: string = "";

  public get azureClientId(): string {
    return this.__azureClientId;
  }

  public set azureClientId(value: string) {
    this.__azureClientId = value;

    this.__saveLocalInstance();
  }

  // #endregion GETTERS/SETTERS

  private async __saveLocalInstance(): Promise<void> {

    if (this.__isSaving) {
      return;
    }

    this.__isSaving = true;

    localStorage.setItem(this.__local_key, this.toJson());

    // Método com customizações para salvar informações na storage
    this._customStorageService.storageSaveLocalInstance();

    this.__notSaving();
  }

  private async __notSaving(): Promise<void> {
    this.__isSaving = false;
  }

  /**
   * Salva a instância como JSON seguro, ignorando objetos que não podem se tornar um JSON.
   */
  public toJson(): string {
    const json = `
    {
      "__ip": "${this.ip}",
      "__tenantId": ${this.tenantId},
      "__infraUsuarioId": "${this.infraUsuarioId}",
      "__infraEstabId": "${this.infraEstabId}",
      "__infraEstabNome": "${this.infraEstabNome}",
      "__infraEmpresaId": "${this.infraEmpresaId}",
      "__infraEmpresaNome": "${this.infraEmpresaNome}",
      "__user": "${this.user}",
      "__userName": "${this.userName}",
      "__authToken": "${this.authToken}",
      "__tokenPayload": ${JSON.stringify(this.tokenPayload)},
      "__dominio": "${this.dominio}",
      "__isExternalLogin": ${this.isExternalLogin},
      "__infraInAuthTypeId": ${this.infraInAuthTypeId},
      "__infraIn2FaTypeId": ${this.infraIn2FaTypeId},
      "__is2FaEnabled": ${this.is2FaEnabled},
      "__azureTenantId": "${this.azureTenantId}",
      "__azureClientId": "${this.azureClientId}"
    }
    `;

    return json;
  }

  /** Inicia a verificação do login. */
  public startLoginCheck() {

    if (!this.__isCheckingAuth) {
      this.reCheckLogin();
    }

  }

  /**
   * Verifica a cada diferença de tempo entre a data atual e a data do token.
   */
  public async reCheckLogin() {

    if (this.__authToken === undefined || this.__authToken === '' || this.authToken === null || this.authToken === '') {
      this.__isCheckingAuth = false;
      return;
    }

    this.__isCheckingAuth = true;

    let isRenewToken: boolean = false;
    let nowDate: number = Math.round(Date.now() / 1000);

    if (this.tokenPayload.exp <= nowDate) {
      isRenewToken = true;
    }

    let leftTime: number = this.tokenPayload.exp - nowDate

    if (leftTime <= 0) {
      isRenewToken = true;
    }

    // TODO: Alterar aqui para não deslogar e avisar o usuário para logar denovo.
    if (isRenewToken) {
      const response = await this.getNewToken();

      if (response !== undefined && response !== null && response != '') {
        this.authToken = response;
        nowDate = Math.round(Date.now() / 1000);
        leftTime = this.tokenPayload.exp - nowDate;
      } else {
        this.logout();

        return;
      }

    }

    if (this.ignoreCheckLogin) {
      this.ignoreCheckLogin = false;
    } else {
      // Método com customizações para inicializações da AutoStorage
      this._customStorageService.storageInitializeAutoStorage();
    }

    this.isLoggedInSub.next(true);

    setTimeout(this.reCheckLogin.bind(this), leftTime * 1000);
  }

  public logout(): void {
    this.__isCheckingAuth = false;
    this.isLoggedInSub.next(false);
    this.__UrlRedirect = "/";
    this.__ip = "";
    this.__tenantId = 0;
    this.__infraUsuarioId = "";
    this.__infraEstabId = "";
    this.__infraEstabNome = "";
    this.__infraEmpresaId = "";
    this.__infraEmpresaNome = "";
    this.__user = "";
    this.__userName = "";
    this.__authToken = "";
    this.__dominio = "";
    this.__tokenPayload = {} as Payload;
    this.__isExternalLogin = false;
    this.__infraInAuthTypeId = 0;
    this.__infraIn2FaTypeId = null;
    this.__is2FaEnabled = false;
    this.__azureTenantId = "";
    this.__azureClientId = "";

    localStorage.removeItem(this.__local_key);

    // Limnpa o armazenamento local do navegador que contém os filtros de um produto específico (com base na prop 'product' do environment)
    this._indexedDBService.deleteDatabase();

    // Método com customizações para finalizações da storage
    this._customStorageService.storageLogout();
  }

  private getNewTokenBack(): Observable<RetToken> {
    let token: Token = {
      domain: this.__dominio,
      user: this.__user,
      tenantId: this.tenantId,
      token: this.authToken,
      infraUsuarioId: this.__infraUsuarioId,
      userName: this.__userName
    }

    const url = `${this._BASE_URL}/GetNewToken`;

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization',
        `Basic ${btoa(`${localStorage.getItem('configServerUser')}:${localStorage.getItem('configServerPassword')}`)}`
      );

    return this._httpClient
      .post<RetToken>(url, token, { 'headers': headers })
      .pipe(
        take(1),
        tap((response) => {

          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

        }),
      );

  }

  private getNewToken(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.getNewTokenBack().subscribe({
        next: response => {
          resolve(response.Token);
        },
        error: error => {
          reject(error);
        }
      });
    });

  }

  /**
  * Renova o Token quando este estiver vencido.
  */
  public async renewToken() {

    if (!this.isLoggedInSub || this.__authToken === undefined || this.__authToken === '' || this.authToken === null || this.authToken === '') {
      return;
    }

    let isRenewToken: boolean = false;
    let nowDate: number = Math.round(Date.now() / 1000);

    if (this.tokenPayload.exp <= nowDate) {
      isRenewToken = true;
    }

    let leftTime: number = this.tokenPayload.exp - nowDate

    if (leftTime <= 0) {
      isRenewToken = true;
    }

    if (isRenewToken) {
      const response = await this.getNewToken();

      if (response !== undefined && response !== null && response != '') {
        this.authToken = response;
      }

    }

  }

  private isPrePortal(): boolean {

    // Identifica se a origem é PrePortal
    var url = new URL(window.location.href);
    var isPrePortal = url.searchParams.get("PrePortal");

    if (isPrePortal != null) {

      if (isPrePortal.toString() == "true") {
        return true
      } else {
        return false
      }

    } else {
      return false
    }

  }

}
