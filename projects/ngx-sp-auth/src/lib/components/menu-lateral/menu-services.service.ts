import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, Subject, take, tap } from 'rxjs';

import { AuthStorageService } from '../../storage/auth-storage.service';
import { LibCustomEnvironmentService } from '../../custom/lib-custom-environment.service';
import { RetError, RetEstabelecimentosModal } from 'ngx-sp-infra';

import { Usuario_IMG } from './model/usuario-img';
import { RetInfraUsuarioEmail } from './model/ret-infrausuarioemail';
import { RetInfraUsuarioImg } from './model/ret-infrausuarioimg';
import { RetEstabelecimentoSession } from './model/ret-estabelecimento-session';
import { RetNavSubMenu, RetSubmenuWithCards } from './model/ret-navsubmenu';
import { NavSubmenuSearchItem } from './model/navsubmenu-searchitem';
import { RetDynamicMenu } from './model/dynamic-menu';

@Injectable({
  providedIn: 'root'
})
export class MenuServicesService {
  private readonly _BASE_URL: string = ""; // SpInfra2AplicWS
  private readonly _HTTP_HEADERS = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private _authStorageService: AuthStorageService,
    private _httpClient: HttpClient,
    private _customEnvironmentService: LibCustomEnvironmentService
  ) {
    this._BASE_URL = `${ this._customEnvironmentService.SpInfra2ErpWS }`; // SpInfra2ErpWS

    this._BASE_URL = !this._customEnvironmentService.production ? this._BASE_URL : `${this._customEnvironmentService.SpInfra2ErpWS}`;
  }

  // #region ==========> SERVICES <==========

  // #region PREPARATION

  // #region Menu: Usuário
  // [...]
  // #endregion Menu: Usuário

  // #region Menu: Estabelecimentos

  public getEstabelecimentosModalList(usuarioID: string, pesquisa: string): Observable<RetEstabelecimentosModal> {
    const params = new HttpParams()
      .set('pesquisa', pesquisa)

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const url = `${this._BASE_URL}/InfraEstabelecimento/GetEstabelecimentosModal`;

    return this._httpClient
      .get<RetEstabelecimentosModal>(url, { 'params': params, 'headers': headers })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      )
  }

  // #endregion Menu: Estabelecimentos

  // #endregion PREPARATION

  // #region GET

  // #region Menu: Usuário

  public getImagemMenu(): Observable<RetInfraUsuarioImg> {

    const url = `${this._BASE_URL}/InfraUsuario/GetImagemMenu`;

    return this._httpClient
      .get<RetInfraUsuarioImg>(url, { 'headers': this._HTTP_HEADERS })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }

          this.saveImageToStorage(response.InfraUsuarioImg.IMAGEM, response.InfraUsuarioImg.FILENAME);
        })
      )
  }

  // #endregion Menu: Usuário

  // #region Menu: Estabelecimentos

  public getEstabelecimentoSession(estabID: string): Observable<RetEstabelecimentoSession> {
    const params = new HttpParams()
      .set('id', estabID);

    const url = `${this._BASE_URL}/InfraEstabelecimento/GetEstabelecimentoSession`;

    return this._httpClient
      .get<RetEstabelecimentoSession>(url, { 'params': params, 'headers': this._HTTP_HEADERS })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      )
  }

  // #endregion Menu: Estabelecimentos

  // #region Get Usuario Email

  public getUsuarioEmail(): Observable<RetInfraUsuarioEmail> {
    const url = `${this._BASE_URL}/InfraUsuario/GetUsuarioEmail`;

    return this._httpClient
      .get<RetInfraUsuarioEmail>(url, { 'headers': this._HTTP_HEADERS })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      )
  }

  // #endregion Get Usuario Email

  // #endregion GET

  // #region UPDATE

  // #region Menu: Usuário
  public updateLastLogEstabID(estabID: string): Observable<RetError> {
    const params = new HttpParams()
      .set('estabID', estabID)

    const url = `${this._BASE_URL}/InfraUsuario/UpdateLastSelectedEstabelecimento`;

    return this._httpClient
      .post<RetError>(url, null, { 'params': params, 'headers': this._HTTP_HEADERS })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) { throw Error(response.ErrorMessage); }
        })
      )
  }
  // #endregion Menu: Usuário

  // #region Menu: Estabelecimentos
  public defineDefaultEstabelecimento(estabID: string, usuarioID: string, isDefault: boolean): Observable<RetError> {
    const params = new HttpParams()
      .set('estabID', estabID)
      .set('isDefault', isDefault)

    const url = `${this._BASE_URL}/InfraEstabelecimento/DefineDefaultEstab`;

    return this._httpClient
      .post<RetError>(url, null, { 'params': params, 'headers': this._HTTP_HEADERS })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      )
  }
  // #endregion Menu: Estabelecimentos

  // #endregion UPDATE

  // #region Menu Dinâmico

  /** Método executado para pegar o Menu lateral levando em conta as permissões do usuário, grupo e o tenant ativo
  * Executado caso o getter do boolean Menu Dynamic seja true
  */
  public getMenuLateral(moduloId: number){
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    const url = `${this._BASE_URL}/Menu/GetMenuLateral`;

    const params: HttpParams = new HttpParams()
      .set('moduloId', moduloId)

    return this._httpClient
      .get<RetDynamicMenu>(url, {params:params, headers: headers })
      .pipe(
        take(1),
        tap((response) => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      );

  }

  /** Método executado para montar estrutura de título, submenu e telas de acordo com os modelos presentes na ngx-sp-infra
  * envia-se o título deste grupo de submenus, ícone e enum daqueles submenus que 
  * ficarão alocados no grupo de determinado título enviado
  */
  public getTelaSubmenus(NavSubmenuSearchItems: NavSubmenuSearchItem[]): Observable < RetNavSubMenu > {
  
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
  
    const url = `${this._BASE_URL}/Menu/GetTelaSubmenus`;
  
    return this._httpClient
    .post<RetNavSubMenu>(url, JSON.stringify(NavSubmenuSearchItems), {'headers': headers })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      );

  }
  
  /** Método executado para montar estrutura da tela de submenu com os cards baseado no IdUnico do menu acessado em específico
  */
  public getTelaSubmenusWithCards(MenuIdUnico:number): Observable < RetSubmenuWithCards > {
  
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    
    const url = `${this._BASE_URL}/Menu/GetTelaSubmenusWithCards`;
  
    const params : HttpParams = new HttpParams()
    .set('MenuIdUnico', MenuIdUnico)
  
    return this._httpClient
      .get<RetSubmenuWithCards>(url, {'params':params, 'headers': headers })
      .pipe(
        take(1),
        tap(response => {
          if (response.Error) {
            throw Error(response.ErrorMessage);
          }
        })
      );

  }

  // #endregion Menu Dinâmico

  // #endregion ==========> SERVICES <==========


  // #region ==========> UTILITIES <==========
  private _menuFooterImg: Usuario_IMG | null = null;

  public getMenuFooterImg(): Usuario_IMG | null {
    const cachedFooterImg = JSON.parse(localStorage.getItem('menuFooterImg')!);

    if (cachedFooterImg) { return cachedFooterImg; }
    return this._menuFooterImg;
  }
  public setMenuFooterImg(value: Usuario_IMG): void {
    this._menuFooterImg = value;
    localStorage.setItem('menuFooterImg', JSON.stringify(value));
  }


  public saveImageToStorage(footerImgSrc: string, footerImgName: string): void {
    this.setMenuFooterImg({ USUARIOID: this._authStorageService.infraUsuarioId, FILENAME: footerImgName, FILE: footerImgSrc });
  }


  // #region NewImg Event

  // Implementação de lógica vista no link: https://hasangalakdinu.medium.com/how-to-call-a-function-in-another-component-angular-using-rxjs-3f2e85920705
  private _subject = new Subject<any>();

  public newUserImageEvent(value: any): void {
    this._subject.next(value);
  }

  public getNewUserImageEvent(): Observable<any> {
    return this._subject.asObservable();
  }

  // #endregion NewImg Event

  // #endregion ==========> UTILITIES <==========

}
