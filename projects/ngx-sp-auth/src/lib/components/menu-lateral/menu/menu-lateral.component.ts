import { Component, OnInit, ViewChild, TemplateRef, ContentChild } from "@angular/core";
import { RouterModule, Router, NavigationEnd } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { LibIconsComponent, MessageService } from "ngx-sp-infra";
import { filter, Subject } from "rxjs";
import { AuthService } from "../../../auth.service";
import { LibCustomMenuService } from "../../../custom/lib-custom-menu.service";
import { MenuConfigService } from "../../../custom/menu-config.service";
import { AuthStorageService } from "../../../storage/auth-storage.service";
import { PrimaryDropdownComponent } from "../dropdown/primary-dropdown/primary-dropdown.component";
import { MenuServicesService } from "../menu-services.service";
import { IMenuItemStructure } from "../model/imenu-item-structure.model";
import { ISubmenuItemStructure } from "../model/isubmenu-item-structure.model";
import { Usuario_IMG } from "../model/usuario-img";
import { DynamicMenuComponent } from "../submenus/dynamic-menu/dynamic-menu.component";
import { NotifSubmenuComponent } from "../submenus/notif-submenu/notif-submenu.component";
import { SelecaoEstabelecimentosModalComponent } from "./selecao-estabelecimentos-modal/selecao-estabelecimentos-modal.component";


@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss'],
  imports: [LibIconsComponent, PrimaryDropdownComponent, SelecaoEstabelecimentosModalComponent, NotifSubmenuComponent, RouterModule, TooltipModule, DynamicMenuComponent, PopoverModule],
})
export class MenuLateralComponent implements OnInit {
  constructor(
    public _customMenuService: LibCustomMenuService,
    private _authStorageService: AuthStorageService,
    private _bsModalService: BsModalService,
    private _menuServices: MenuServicesService,
    private _messageService: MessageService,
    //private _projectUtilService: ProjectUtilservice,
    private _router: Router,
    private _authService: AuthService
  ) {
    // Implementação que verifica eventos acionados na classe de service.
    this._menuServices.getNewUserImageEvent().subscribe(() => { this.getMenuUserImg(); })
  }

  public ngOnInit(): void {

    // Inscreva-se no evento NavigationEnd para receber notificações quando a rota mudar, serve para atualizar a seleção do menu corretamente
    this._router.events.pipe().subscribe((event: any) => {
      this._customMenuService.menuItems = this._customMenuService.menuConfig.updateRouteSelection(this._router.url, this._customMenuService.menuItems)
    });

    if (!this._customMenuService.menuDynamic) {
      this._customMenuService.menuConfig.setMenuStatic(true);
      this._customMenuService.menuItems = this._customMenuService.menuConfig.initializeMenu(this._router.url);

      // Método com customizações para inicialização do Menu Estático
      this._customMenuService.menuStaticOnInit();
    }
    else {
      // Método com customizações para inicialização do Menu Dinâmico
      this._customMenuService.menuDynamicOnInit();
    }

    this.nomeEstabelecimento = this._authStorageService.infraEstabNome;
    this.footerUserName = this._authStorageService.userName;

    this.checkForCachedImage();

    this.getUserEmail();
  }

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE

  // ERICK: vou manter este por enquanto para quando for necessário esta funcionalidade eu consiga refazê-las sem muito problema
  @ViewChild("notif_menu") private notif_template?: TemplateRef<any>;

  // #region PUBLIC

  @ViewChild('menuLink') public menuLink?: HTMLAnchorElement;
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



  // propriedades iniciadas quando passar o CustomMenuService

  public menuDynamic: boolean = false;
  public menuConfig: MenuConfigService = new MenuConfigService;

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
        //this._projectUtilService.showHttpError(error); 
        this._messageService.showAlertDanger(error);
        throw new Error(error);
      }
    })
  }

  private getMenuUserImg(): void {
    this._menuServices.getImagemMenu().subscribe({
      next: response => { this.footerUserImgSrc = response.InfraUsuarioImg.IMAGEM; },
      error: error => {
        //this._projectUtilService.showHttpError(error);
        this._messageService.showAlertDanger(error);
        throw new Error(error);
      }
    })
  }

  public getUserEmail(): void {
    this._menuServices.getUsuarioEmail().subscribe({
      next: response => { this.footerUserEmail = response.Email; },
      error: error => {
        //this._projectUtilService.showHttpError(error);
        this._messageService.showAlertDanger(error);
        throw new Error(error);
      }
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

    if (menu.children && menu.children.length > 0) {
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

  // public onClickedOutside(e: Event, ref: HTMLDivElement): void {
  //   ref.classList.remove("opened-sub");
  //   this.submenuList = [];
  // }

  public onClickedOutside(e: Event, ref: HTMLDivElement): void {
    if (ref) {
      ref.classList.remove("opened-sub");
      this.submenuList = [];
    } else {
      console.warn('ref is undefined or null');
    }
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
    this._authService.logout();
  }

  public getExternalUrl(url: string) {
    return `https://siscandesv6.sispro.com.br/SisproErpCloud/${url}`;
  }

  // #endregion ==========> UTILITIES <==========

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
