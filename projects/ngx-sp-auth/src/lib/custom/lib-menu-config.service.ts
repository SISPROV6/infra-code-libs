import { Injectable } from "@angular/core";
import { IMenuItemStructure } from '../components/menu-lateral/model/imenu-item-structure.model';
import { IMenuConfig } from "./models/imenu-config";

@Injectable(
    { providedIn: 'root' }
)
/**Service responsável por pegar as opções do menu do projeto em que está sendo utilizada*/
export class LibMenuConfigService {

    public storedInitializeMenu!: (currentRoute: string, customList?: IMenuItemStructure[]) => IMenuItemStructure[];

    public storedInitializeMenuDropdown!: (primaryDropdownList: Array<any>) => any[];

    public storedSetMenuType!: (isStaticMenu: boolean) => void;

    public storedUpdateRouteSelection!: (currentRoute: string, currentList: IMenuItemStructure[]) => IMenuItemStructure[];

    public menu: IMenuItemStructure[] = []
    public menuDropdown: any[] = [];

    /** Inicializa as opções do menu com base na rota atual e em uma lista personalizada (opcional).
    * @param currentRoute A rota atual da aplicação
    * @param customList Uma lista personalizada de opções de menu (opcional).
    * @returns As opções do menu inicializadas.
    */
    public initializeMenu(currentRoute: string, customList?: IMenuItemStructure[]): IMenuItemStructure[] {
        
        this.menu = this.storedInitializeMenu(currentRoute, customList);
        
        return this.menu;
    }

    public setMenuType(isStaticMenu: boolean): void {
        this.storedSetMenuType(isStaticMenu);
    }

    public updateRouteSelection(currentRoute: string, currentList: IMenuItemStructure[]): IMenuItemStructure[] {
        return this.updateRouteSelection(currentRoute, currentList);
    }

    /** Inicializa as opções do menu dropdown com base em uma lista personalizada (opcional).
       * @param primaryDropdownList Uma lista personalizada de opções do dropdown (opcional).
       * @returns As opções do dropdown inicializadas.
    */
    public initializeMenuDropdown(primaryDropdownList: Array<any>): any[] {
        this.menuDropdown = this.storedInitializeMenuDropdown(primaryDropdownList);
 
        return this.menuDropdown;
    }

    public ConfigurarMenuConfig(menuConfig: IMenuConfig): void {

        //passando implementação dos métodos do projeto para a lib
        this.storedInitializeMenu = menuConfig.initializeMenu;
        
        this.storedInitializeMenuDropdown = menuConfig.initializeMenuDropdown;

        this.storedSetMenuType = menuConfig.setMenuType;

        this.updateRouteSelection = menuConfig.updateRouteSelection;
    }
}
