import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { IMenuItemStructure } from '../components/menu-lateral/model/imenu-item-structure.model';
import { AuthStorageService } from '../storage/auth-storage.service';
import { LibMenuConfigService } from './lib-menu-config.service';
import { ICustomMenuService } from './models/icustom-menu-service';
import { LIB_CUSTOM_MENU_SERVICE } from './token';

@Injectable(
    { providedIn: 'root' }
)
export class LibCustomMenuService {

    // #region Propriedade Customizadas do Menu

    public get menuDynamic(): boolean {
        return this._customMenuService.menuDynamic;
    }

    public get menuDynamicCustom(): boolean {
        return this._customMenuService.menuDynamicCustom;
    }

    public get moduleName(): string {
        return this._customMenuService.moduleName;
    }

    public get moduleImg(): string {
        return this._customMenuService.moduleImg;
    }

    public get moduleSvg(): string {
        return this._customMenuService.moduleSvg;
    }

    public get themeColor(): string {
        return this._customMenuService.themeColor;
    }

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
        @Inject(LIB_CUSTOM_MENU_SERVICE) private _customMenuService: ICustomMenuService,
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
        return this._customMenuService.menuDynamicGetModuloId();
    }
    
    // Método executado no menu-lateral.component.ts - método: onInit ()
    // Utilizado para inicializações diversas
    public menuDynamicOnInit(): void {
        this._customMenuService.menuDynamicOnInit();
    }

    // Método executado no menu-lateral.component.ts - método: onInit ()
    // Utilizado para inicializações diversas
    public menuStaticOnInit(): void {
        this._customMenuService.menuStaticOnInit();
    }

    // Método executado no menu-lateral.component.ts - método: openExpansibleMenu()
    // Utilizado para inicializações ao Expandir a opção de Menu
    public menuopenExpansibleMenu(ref: HTMLDivElement): void {
        this._customMenuService.menuopenExpansibleMenu(ref);
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
