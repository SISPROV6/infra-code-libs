import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { IMenuItemStructure } from '../components/menu-lateral/model/imenu-item-structure.model';
import { IMenu } from '../components/menu-lateral/model/imenu.model';
import { AuthStorageService } from '../storage/auth-storage.service';
import { MenuConfigService } from './menu-config.service';
import { ICustomMenuService } from './models/icustom-menu-service';

@Injectable(
    { providedIn: 'root' }
)
export class LibCustomMenuService {

    public menuService!: ICustomMenuService;

    // #region Propriedade Customizadas do Menu

    public menuDynamic: boolean = false;

    public moduleName: string = "";

    public moduleImg: string = "";

    public moduleSvg: string = "";

    public themeColor: string = "";

    // #endregion Propriedade Customizadas do Menu

    // #region Propriedade do Menu

    private readonly _MENU_BASE_URL: string = "https://siscandesv6.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2ErpWS/api";

    private currentURL: string = "";
    private _menuItems: IMenuItemStructure[] = [];
    private menuList: IMenu[] = [];
    private menuLateralUpdated: IMenuItemStructure[] = [];
    //verificar esse cara aqui
    public menuConfig: MenuConfigService;

    /** Obtém as opções do menu. */
    public get menuItems(): IMenuItemStructure[] {
        return this._menuItems;
    }

    public set menuItems(value: IMenuItemStructure[]) {
        this._menuItems = value;
    }

    // ! Definição do BehaviorSubject: responsável principal da emissão do evento
    private empresaId: BehaviorSubject<{ estabelecimentoID: string, empresaID: string }> = new BehaviorSubject<{ estabelecimentoID: string, empresaID: string }>({ estabelecimentoID: "", empresaID: "" });
    public applyEmpresa$: Observable<{ estabelecimentoID: string, empresaID: string }> = this.empresaId.asObservable();

    public setEmpresa(value: { estabelecimentoID: string, empresaID: string }) { this.empresaId.next(value) }
    // ! Definição do BehaviorSubject: responsável principal da emissão do evento

    // #endregion Propriedade do Menu

    private storedMenuStaticOnInit?: () => void;
    private storedMenuDynamicOnInit?: () => void;
    private storedMenuopenExpansibleMenu?: (ref: HTMLDivElement) => void;


    constructor(
        private _menuConfig: MenuConfigService,
        private _authStorageService: AuthStorageService,
        private _router: Router,

    ) {
        // inicializações do Menu Dinâmico
        this.currentURL = this._router.url;
        this.menuConfig = _menuConfig;
    }

    public ConfigurarCustomMenuService(RealcustomMenuService: ICustomMenuService): void {

        //passando propriedades do projeto para a lib
        this.menuDynamic = RealcustomMenuService.menuDynamic;
        this.moduleName = RealcustomMenuService.moduleName;
        this.moduleImg = RealcustomMenuService.moduleImg;
        this.moduleSvg = RealcustomMenuService.moduleSvg;
        this.themeColor = RealcustomMenuService.themeColor;

        //passando implementação dos métodos do projeto para a lib
        this.storedMenuStaticOnInit = RealcustomMenuService.menuStaticOnInit;
        this.storedMenuopenExpansibleMenu = RealcustomMenuService.menuopenExpansibleMenu;
        this.storedMenuDynamicOnInit = RealcustomMenuService.menuDynamicOnInit;
    }

    // #region - Métodos Customizadas para o Menu dinâmico

    // Método executado no menu-lateral.component.ts - método: onInit ()
    // Utilizado para inicializações diversas
    public menuDynamicOnInit(): void {
        if (this.storedMenuDynamicOnInit) {
            this.storedMenuDynamicOnInit();
        }
    }

    // Método executado no menu-lateral.component.ts - método: onInit ()
    // Utilizado para inicializações diversas
    public menuStaticOnInit(): void {
        if (this.storedMenuStaticOnInit) {
            this.storedMenuStaticOnInit();
        }
    }

    // Método executado no menu-lateral.component.ts - método: openExpansibleMenu()
    // Utilizado para inicializações ao Exoandir a opção de Menu
    public menuopenExpansibleMenu(ref: HTMLDivElement): void {
        if (this.storedMenuopenExpansibleMenu) {
            this.storedMenuopenExpansibleMenu(ref);
        }
    }

    /** Método que deve ser chamado na seleção de um novo estabelecimento, ele atualizará os valores do nosso BehaviorSubject para que possamos utilizá-lo em outras partes do sistema. */
    public emitEstabelecimentoEvent(): void {

        this.setEmpresa({
            estabelecimentoID: this._authStorageService.infraEstabId,
            empresaID: this._authStorageService.infraEmpresaId
        });
    }
    // #endregion - Métodos Customizadas para o Menu dinâmico
}
