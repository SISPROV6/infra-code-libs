import { CommonModule, NgIf } from '@angular/common';
import { Component, ContentChild, ElementRef, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, Subject } from 'rxjs';

import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, LogLevel, PublicClientApplication } from '@azure/msal-browser';

import { BsModalService } from 'ngx-bootstrap/modal';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrService } from 'ngx-toastr';

import { InfraModule, MessageService } from 'ngx-sp-infra';
import { AuthStorageService } from '../../../storage/auth-storage.service'
import { LibCustomMenuService } from '../../../custom/lib-custom-menu.service';
import { ProjectUtilservice } from '../../../project/project-utils.service';
import { MenuServicesService } from '../menu-services.service';

import { AuthService } from '../../../auth.service';
import { InfraInAuthTypeId } from '../../../models/infraInAuthTypeId';
import { LibCustomEnvironmentService } from '../../../custom/lib-custom-environment.service';
import { PrimaryDropdownComponent } from '../dropdown/primary-dropdown/primary-dropdown.component';
import { IMenuItemStructure } from '../model/imenu-item-structure.model';
import { ISubmenuItemStructure } from '../model/isubmenu-item-structure.model';
import { Usuario_IMG } from '../model/usuario-img';
import { DynamicMenuComponent } from '../submenus/dynamic-menu/dynamic-menu.component';
import { NotifSubmenuComponent } from '../submenus/notif-submenu/notif-submenu.component';
import { SelecaoEstabelecimentosModalComponent } from './selecao-estabelecimentos-modal/selecao-estabelecimentos-modal.component';
import { DynamicMenu } from '../model/dynamic-menu';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss'],
  imports: [
    PopoverModule,
    TooltipModule,
    InfraModule,
    SelecaoEstabelecimentosModalComponent,
    NotifSubmenuComponent,
    DynamicMenuComponent,
    PrimaryDropdownComponent,
    CommonModule,
    RouterLink,
    RouterOutlet,
    NgIf
  ]
})
export class MenuLateralComponent implements OnInit, OnDestroy  {
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private _msalGuardConfiguration: MsalGuardConfiguration,
    private _msalService: MsalService,		
    private _toastrService: ToastrService,
    public _customMenuService: LibCustomMenuService,
    private _customEnvironmentService: LibCustomEnvironmentService,
    private _authStorageService: AuthStorageService,
    private _bsModalService: BsModalService,
    private _menuServices: MenuServicesService,
    private _messageService: MessageService,
    private _projectUtilService: ProjectUtilservice,
    private _router: Router,
    private _authService: AuthService
  ) {
    // Implementação que verifica eventos acionados na classe de service.
    this._menuServices.getNewUserImageEvent().subscribe( () => { this.getMenuUserImg(); })
  }

  public async ngOnInit() {

    document.addEventListener('keydown', this.handleKeyboardShortcut);

    // Inscreva-se no evento NavigationEnd para receber notificações quando a rota mudar, serve para atualizar a seleção do menu corretamente
    this._router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: any) => { this._customMenuService.menuItems = this._customMenuService.menuConfig.updateRouteSelection(this._router.url, this._customMenuService.menuItems) });

    if (!this._customMenuService.menuDynamic && !this._customMenuService.menuDynamicCustom) {
      this._customMenuService.menuConfig.setMenuType(true);
 
      this._customMenuService.menuItems = this._customMenuService.menuConfig.initializeMenu(this._router.url);    

      // Método com customizações para inicialização do Menu Estático
      this._customMenuService.menuStaticOnInit();
    }
    else
    {
      // Método com customizações para inicialização do Menu Dinâmico
      
      if (this._customMenuService.menuDynamic) {
        this._customMenuService.menuConfig.setMenuType(false);

        // Método com customizações obter o Módulo para montagem do Menu Dinâmico Lateral
        const moduloId: number = this._customMenuService.menuDynamicGetModuloId();

        this._menuServices.getMenuLateral(moduloId).subscribe({
          next: response => {
            const menus = this.constroiRegrasDynamicMenu(response.MenuSubmenu);

            this._customMenuService.menuItems = this._customMenuService.menuConfig.initializeMenu(this._router.url, menus);
          }, error: error => {
            this._customMenuService.menuItems = this._customMenuService.menuConfig.initializeMenu(this._router.url);
          }
        })
      }

      this._customMenuService.menuDynamicOnInit(); 
    }

    this.nomeEstabelecimento = this._authStorageService.infraEstabNome;
    this.footerUserName = this._authStorageService.userName;

    this.checkForCachedImage();

    this.getUserEmail();

    // Tratamemto exclusivo para o método de autenticação Azure
    if (this._authStorageService.infraInAuthTypeId == InfraInAuthTypeId.Azure && this._authStorageService.user.toLowerCase() != "admin") {
      await this.initMsal();
    }      

  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeyboardShortcut);
  }

  @ViewChild('sidebar', { static: true }) sidebar!: ElementRef<HTMLDivElement>;
  
  handleKeyboardShortcut = (event: KeyboardEvent): void => {
    if (event.ctrlKey && event.key.toLowerCase() === 'b') {
      event.preventDefault(); // Prevents any default behavior (like bold in text editors)
      this.openExpansibleMenu(this.sidebar.nativeElement);
    }
  };
  // #region ==========> PROPERTIES <==========

  // #region PRIVATE

  // ERICK: vou manter este por enquanto para quando for necessário esta funcionalidade eu consiga refazê-las sem muito problema
  @ViewChild("notif_menu") private notif_template?: TemplateRef<any>;
  
  // #region PUBLIC

  @ViewChild('menuLink') public menuLink!: HTMLAnchorElement;
  @ContentChild(TemplateRef) public desiredContent?: TemplateRef<any>;

  public readonly MODAL_ESTABELECIMENTO: number = 1;
  
  public nomeEstabelecimento: string = 'Estabelecimento padrão';
  public titleSubmenu: string = "";
  public submenuList: (ISubmenuItemStructure | undefined)[] = [];
  
  public messageIfClicked = new Subject<boolean>();

  /** Esta variável é usada na abertura do submenu e do submenu secundário para 
    * que a função onClickedOutside() que está na segunda div principal do HTML do
    * componente não seja ativada, pois se ela for ativada ela irá fechar o menu
    * lateral, e quando vamos do submenu para o submenu secundário não queremos
    * fechar o menu lateral, e quando vamos do submenu secundário para o submenu
    * também não queremos fechar o menu lateral;
  */
  public closeMenu: boolean = true;

  /** Utilizada como a fonte da imagem de perfil do usuário logado no sistema. */
  public footerUserImgSrc: string = "";

  /** Emai do usuário logado para ser exibido no popover */
  public footerUserEmail: string = "";

  /** Nome do usuário logado para ser exibido no rodapé do menu. */
  public footerUserName: string = "Usuário";
  
  public isPopoverVisible: boolean = false;
  public showBalloon: boolean = false;

  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========

  // #region ==========> SERVICES <==========

  // #region GET
  private getEstabelecimentoSession(estabID: string): void {
    this._menuServices.getEstabelecimentoSession(estabID).subscribe({
      next: response => { 
        this.nomeEstabelecimento = response.InfraEstabNome; 
        this._authStorageService.infraEmpresaId = response.InfraEmpresaId;
        this._authStorageService.infraEmpresaNome = response.InfraEmpresaNome;
      },
      error: error => { 
        this._projectUtilService.showHttpError(error); 
      }
    })
  }

  private getMenuUserImg(): void {
    this._menuServices.getImagemMenu().subscribe({
      next: response => { this.footerUserImgSrc = response.InfraUsuarioImg.IMAGEM; },
      error: error => { this._projectUtilService.showHttpError(error); }
    })
  }

  public getUserEmail(): void {
    this._menuServices.getUsuarioEmail().subscribe({
      next: response => { this.footerUserEmail = response.Email; },
      error: error => { this._projectUtilService.showHttpError(error); }
    })
  }
  // #endregion GET

  // #region UPDATE
  public updateLastLogEstabelecimento(estab: string): void {
    this._menuServices.updateLastLogEstabID(estab.split(" - ")[0]).subscribe({
      next: () => {
        this._messageService.showAlertSuccess('Estabelecimento alterado com sucesso!');

        this.getEstabelecimentoSession(estab.split(" - ")[0]);
      }
    })

    this._authStorageService.infraEstabId = estab.split(" - ")[0];
    this._authStorageService.infraEstabNome = estab.split(" - ")[1];
  }
  // #endregion UPDATE

  // #endregion ==========> SERVICES <==========

  // #region ==========> UTILITIES <==========

  public togglePopover() { this.showBalloon = !this.showBalloon; }

  public dropdownWasOpened(value: boolean): void { this.messageIfClicked.next(value); }

  public openExpansibleMenu(ref: HTMLDivElement): void {
    ref.classList.toggle("closed");
    ref.classList.toggle("col");
    document.querySelector(".sidebar-control")?.classList.toggle("col");
  
    // Método com customizações para inicialização do Menu Estático
    this._customMenuService.menuopenExpansibleMenu(ref);          
  }

  public openSubmenu(menu: IMenuItemStructure, ref: HTMLDivElement, desiredMenu: TemplateRef<any>): void {
    
    if (menu.children && menu.children.length > 0 && menu.route == "") {
      this.titleSubmenu = menu.label
      this.desiredContent = desiredMenu;
      ref.classList.remove("opened-notif-sub");

      if (this.submenuList === menu.children) {
        this.closeMenu = false;
      }
      else if (!ref.classList.contains("opened-sub")) { ref.classList.toggle("opened-sub"); }
      this.submenuList = menu.children;
    }
    
    else if (!menu.children || (menu.children && menu.children.length == 0)) {
      this.submenuList = [];
      ref.classList.toggle("selectedItem");
      this.onClickedOutside(new Event(""), ref);
    }
  }

  public onClickedOutside(e: Event, ref: HTMLDivElement): void {
    ref.classList.remove("opened-sub");
    this.submenuList = [];
  }

  // #region MENU FOOTER USER IMAGE
  private validateCachedImg(footerImg: Usuario_IMG | null): boolean {
    let usuarioId: string = this._authStorageService.infraUsuarioId;

    if (!footerImg || footerImg == null) { return true; }
    
    if (usuarioId != footerImg.USUARIOID) { return true; }
    
    this.footerUserImgSrc = footerImg.FILE;
    return false;
  }

  private checkForCachedImage(): void {
    const isAPIRequestNeeded = this.validateCachedImg(this._menuServices.getMenuFooterImg());
    if (isAPIRequestNeeded) { this.getMenuUserImg(); }
  }
  // #endregion MENU FOOTER USER IMAGE

  public logout(): void {
    
    // Verifica se é Login Azure
    if (this._authStorageService.infraInAuthTypeId == InfraInAuthTypeId.Azure && this._authStorageService.user.toLowerCase() != "admin") {
      const hostAuthLogin = !this._customEnvironmentService.production ? "http://localhost:4200/auth/login" : `${ this._customEnvironmentService.hostName }/SisproErpCloud/${ this._customEnvironmentService.product }/auth/login`;


      this._msalService.logoutRedirect({
        postLogoutRedirectUri: hostAuthLogin
      });
    }
  
    this._authService.logout();
  }

  public getExternalUrl(url: string) {
     return `${ this._projectUtilService.getHostName() }/${ url }`;
  }

  public constroiRegrasDynamicMenu(menus: DynamicMenu[]) {
    const home = { id: 1, label: "Início", descricao: "Tela inicial", icon: "casa", route: "home", isExternal: false, isSelected: this._router.url.includes("home"), }
    menus.unshift(home);
    return menus;
  }

  // #endregion ==========> UTILITIES <==========

  // #region Azure

  private async configMsal() {
    const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;
		const hostAuthLogin = !this._customEnvironmentService.production ? "http://localhost:4200/auth/login" : `${ this._customEnvironmentService.hostName }/SisproErpCloud/${ this._customEnvironmentService.product }/auth/login`;

    this._msalService.instance = new PublicClientApplication({
      auth: {
        clientId: `${ this._authStorageService.azureClientId }`,
        authority: `https://login.microsoftonline.com/${ this._authStorageService.azureTenantId }`,
        redirectUri: hostAuthLogin + "/",
        postLogoutRedirectUri: hostAuthLogin,
        navigateToLoginRequestUrl: true
        },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: isIE
      },
      system: {
        loggerOptions: {
          loggerCallback: (logLevel, message, containsPii) => {
            console.log(message);
            },
            logLevel: LogLevel.Error,
            piiLoggingEnabled: false
        }
      }
    });
  }

  private async initMsal() {
    await this.configMsal().then(() => {
      this._msalService.handleRedirectObservable().subscribe({
        next: (result: AuthenticationResult) => {

          if (!this._msalService.instance.getActiveAccount() && this._msalService.instance.getAllAccounts().length > 0) {
            this._msalService.instance.setActiveAccount(result.account);
          }

        },
        error: (error) => {
          this._toastrService.warning(`Erro na inicialização dos parâmetros de configuração do 'Azure': ${ error }`, '', { timeOut: 3000, extendedTimeOut: 2000 } );
        }
      });
    });
  }


  // #region ==========> MODALS <==========

  /** Função simples com o objetivo de abrir os modais no centro da tela.
   * @param template Template HTML do modal que será aberto.
   * @param modalID ID do modal que será aberto, para que possa ser referenciado depois.
  */
  openModal(template: TemplateRef<any>, modalID: number) {
    this._bsModalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: false,
      keyboard: false,
      id: modalID
    });
  }

  /** Função simples com o objetivo de fechar os modais que estiverem abertos (baseados pelo ID).
   * @param modalID ID do modal que será fechado.
   */
  closeModal(modalID: number) {
    this._bsModalService.hide(modalID);
  }

  // #endregion ==========> MODALS <==========
}
