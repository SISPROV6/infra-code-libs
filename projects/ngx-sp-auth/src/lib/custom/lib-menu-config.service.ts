import { Inject, Injectable } from "@angular/core";

import { IMenuItemStructure } from '../components/menu-lateral/model/imenu-item-structure.model';
import { IMenuConfig } from "./models/imenu-config";
import { LIB_MENU_CONFIG } from "./token";

@Injectable(
    { providedIn: 'root' }
)
/**Service responsável por pegar as opções do menu do projeto em que está sendo utilizada*/
export class LibMenuConfigService {

    constructor( 
        @Inject(LIB_MENU_CONFIG) private _menuConfig: IMenuConfig
    ) { }

    public menu: IMenuItemStructure[] = []
    public menuDropdown: any[] = [];

    /** Inicializa as opções do menu com base na rota atual e em uma lista personalizada (opcional).
    * @param currentRoute A rota atual da aplicação
    * @param customList Uma lista personalizada de opções de menu (opcional).
    * @returns As opções do menu inicializadas.
    */
    public initializeMenu(currentRoute: string, customList?: IMenuItemStructure[]): IMenuItemStructure[] {
        
        this.menu = this._menuConfig.initializeMenu(currentRoute, customList);
        
        return this.menu;
    }

    public setMenuType(isStaticMenu: boolean): void {
        this._menuConfig.setMenuType(isStaticMenu);
    }

    public updateRouteSelection(currentRoute: string, currentList: IMenuItemStructure[]): IMenuItemStructure[] {
        return this._menuConfig.updateRouteSelection(currentRoute, currentList);
    }

}
