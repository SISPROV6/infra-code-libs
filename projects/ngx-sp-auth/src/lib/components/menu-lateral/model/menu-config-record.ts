import { IMenuItemStructure } from "./imenu-item-structure.model";

/** Classe responsável por configurar as opções do menu. */
export class MenuConfig {
    constructor
        (
            isStaticMenu: boolean,
            currentUrl: string,
            arrayMenuDropdown: Array<any>[],
            InitializeMenu: (currentRoute: string, customLit?: IMenuItemStructure[]) => IMenuItemStructure[]
        ) {
        this._isMenuStatic = isStaticMenu;
        this.stringUrl = currentUrl
        this.arrayMenuDropdawn = arrayMenuDropdown
        this.storedInitializeMenu = InitializeMenu
    }


    private stringUrl: string = "";
    private _menuOptions: IMenuItemStructure[] = [];

    private storedInitializeMenu: (currentRoute: string, customLit?: IMenuItemStructure[]) => IMenuItemStructure[];

    /** Indica se o menu é estático ou dinâmico. */
    public _isMenuStatic: boolean = false;

    //recebe a listaDropdawnMenu do produto
    public arrayMenuDropdawn: Array<any>[] = [];

    /** Obtém as opções do menu. */
    public get menuOptions(): IMenuItemStructure[] { return this._menuOptions; }
    public set menuOptions(value: IMenuItemStructure[]) {
        this._menuOptions = value;
        this.updateRouteSelection(this.stringUrl, value)
    }

    /** Inicializa as opções do menu com base na rota atual e em uma lista personalizada (opcional).
     * @param currentRoute A rota atual da aplicação
     * @param customList Uma lista personalizada de opções de menu (opcional).
     * @returns As opções do menu inicializadas.
     */

    public initializeMenu(currentRoute: string, customLit?: IMenuItemStructure[]): IMenuItemStructure[] {
        return this.storedInitializeMenu(currentRoute, customLit);
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

    public initializeMenuDropdown(primaryDropdownList: Array<any>): Array<any>[] {
        primaryDropdownList = this.arrayMenuDropdawn;
        return primaryDropdownList;
    };
}