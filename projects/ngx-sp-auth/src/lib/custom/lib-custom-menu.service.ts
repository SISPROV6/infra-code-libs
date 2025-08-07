import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { IMenuItemStructure } from '../components/menu-lateral/model/imenu-item-structure.model';
import { AuthStorageService } from '../storage/auth-storage.service';
import { LibMenuConfigService } from './lib-menu-config.service';
import { ICustomMenuService } from './models/icustom-menu-service';

@Injectable(
    { providedIn: 'root' }
)
export class LibCustomMenuService {

    // #region Propriedade Customizadas do Menu

    public menuDynamic: boolean = false;
    public menuDynamicCustom: boolean = false;
    public moduleName: string = "";
    public moduleImg: string = "";
    public moduleSvg: string = "";
    public themeColor: string = "";

    // #endregion Propriedade Customizadas do Menu

    // #region Propriedade do Menu

    private _menuItems: IMenuItemStructure[] = [];
    public menuConfig: LibMenuConfigService;

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

    constructor(
        private _menuConfig: LibMenuConfigService,
        private _authStorageService: AuthStorageService
    ) {
        // inicializações do Menu Dinâmico
        this.menuConfig = _menuConfig;
    }

    // #region - Métodos Customizadas para o Menu dinâmico

    // Método executado no menu-lateral.component.ts - método: onInit ()
    // Utilizado para obter o Módulo para montagem do Menu Dinâmico Lateral
    public menuDynamicGetModuloId(): number
    {
        return this.storeMenuDynamicGetModuloId();
    }
    
    // Método executado no menu-lateral.component.ts - método: onInit ()
    // Utilizado para inicializações diversas
    public menuDynamicOnInit(): void {
        this.storedMenuDynamicOnInit();
    }

    // Método executado no menu-lateral.component.ts - método: onInit ()
    // Utilizado para inicializações diversas
    public menuStaticOnInit(): void {
        this.storedMenuStaticOnInit();
    }

    // Método executado no menu-lateral.component.ts - método: openExpansibleMenu()
    // Utilizado para inicializações ao Expandir a opção de Menu
    public menuopenExpansibleMenu(ref: HTMLDivElement): void {
        this.storedMenuopenExpansibleMenu(ref);
    }

    /** Método que deve ser chamado na seleção de um novo estabelecimento, ele atualizará os valores do nosso BehaviorSubject para que possamos utilizá-lo em outras partes do sistema. */
    public emitEstabelecimentoEvent(): void {

        this.setEmpresa({
            estabelecimentoID: this._authStorageService.infraEstabId,
            empresaID: this._authStorageService.infraEmpresaId
        });
    }

    // #endregion - Métodos Customizadas para o Menu dinâmico

    // #region Métodos recebidos do projeto

    private storeMenuDynamicGetModuloId!: () => number;

    private storedMenuStaticOnInit!: () => void;

    private storedMenuDynamicOnInit!: () => void;

    private storedMenuopenExpansibleMenu!: (ref: HTMLDivElement) => void;

    // #endregion Métodos recebidos do projeto

   // #region Métodos Publicos

    public ConfigurarCustomMenuService(RealcustomMenuService: ICustomMenuService): void {

        //passando propriedades do projeto para a lib
        this.menuDynamic = RealcustomMenuService.menuDynamic;
        this.menuDynamicCustom = RealcustomMenuService.menuDynamicCustom;
        this.moduleName = RealcustomMenuService.moduleName;
        this.moduleImg = RealcustomMenuService.moduleImg;
        this.moduleSvg = RealcustomMenuService.moduleSvg;
        this.themeColor = RealcustomMenuService.themeColor;

        //passando implementação dos métodos do projeto para a lib
        this.storeMenuDynamicGetModuloId = RealcustomMenuService.menuDynamicGetModuloId;

        this.storedMenuStaticOnInit = RealcustomMenuService.menuStaticOnInit;

        this.storedMenuopenExpansibleMenu = RealcustomMenuService.menuopenExpansibleMenu;

        this.storedMenuDynamicOnInit = RealcustomMenuService.menuDynamicOnInit;
    }

   // #endregion Métodos Publicos

}
