import { Injectable } from "@angular/core";
import { IMenuItemStructure } from './../components/menu-lateral/model/imenu-item-structure.model';
import { IMenuConfig } from "./models/imenu-config";

@Injectable(
    { providedIn: 'root' }
)
/**Service responsável por pegar as opções do menu do projeto em que está sendo utilizada*/
export class MenuConfigService {

    private _menuOptions: IMenuItemStructure[] = [];

    /** Indica se o menu é estático ou dinâmico. */
    public _isMenuStatic: boolean = false;

    /** Obtém as opções do menu. */
    public get menuOptions(): IMenuItemStructure[] { return this._menuOptions; }
    public set menuOptions(value: IMenuItemStructure[]) { this._menuOptions = value; }


    public storedInitializeMenu!: (currentRoute: string, customList?: IMenuItemStructure[]) => IMenuItemStructure[];
    public storedUpdateRouteSelection!: (currentRoute: string, currentList: IMenuItemStructure[]) => IMenuItemStructure[];
    public storedInitializeMenuDropdown!: (primaryDropdownList: Array<any>) => any[];


    public menu: IMenuItemStructure[] = []
    public menuDropdown: any[] = [];


    /** Inicializa as opções do menu com base na rota atual e em uma lista personalizada (opcional).
     * @param currentRoute A rota atual da aplicação
     * @param customList Uma lista personalizada de opções de menu (opcional).
     * @returns As opções do menu inicializadas.
     */

    public initializeMenu(currentRoute: string, customList?: IMenuItemStructure[]): IMenuItemStructure[] {
        if (this.storedInitializeMenu) {
            this.menu = this.storedInitializeMenu(currentRoute, customList);
        }
        return this.menu;
    }


    public updateRouteSelection(currentRoute: string, currentList: IMenuItemStructure[]): IMenuItemStructure[] {
        currentList.forEach((item) => {
            if (item.children) { item.children.forEach(child => { child.isSelected = currentRoute.includes(child.route); }) }

            const anyChildSelected = item.children ? item.children.some(child => child.isSelected === true) : false;
            item.isSelected = false;

            if (!item.children && currentRoute.includes(item.route)) { item.isSelected = true; }
            else if (item.children && anyChildSelected) { item.isSelected = true; }
        })

        return currentList;
    }

    /** Inicializa as opções do menu dropdown com base em uma lista personalizada (opcional).
       * @param primaryDropdownList Uma lista personalizada de opções do dropdown (opcional).
       * @returns As opções do dropdown inicializadas.
    */
    public initializeMenuDropdown(primaryDropdownList: Array<any>): any[] {
        if (this.storedInitializeMenuDropdown) {
            this.menuDropdown = this.storedInitializeMenuDropdown(primaryDropdownList);
        }
        return this.menuDropdown;
    }

    public ConfigurarMenuConfig(menuConfig: IMenuConfig): void {

        //passando propriedades do produto para a lib
        this._menuOptions = menuConfig.menuOptions;
        this._isMenuStatic = menuConfig.isMenuStatic;

        //passando implementação dos métodos do produto para a lib
        this.storedInitializeMenu = menuConfig.initializeMenu;
        this.storedInitializeMenuDropdown = menuConfig.initializeMenuDropdown;
    }
}
