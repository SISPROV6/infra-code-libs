import { IMenuItemStructure } from "../../components/menu-lateral/model/imenu-item-structure.model";

export interface IMenuConfig {
    //propriedades menuConfig
    menuOptions: IMenuItemStructure[];
    isMenuStatic: boolean;

    //Métodos menuconfig
    initializeMenu(currentRoute: string, customList?: IMenuItemStructure[]): IMenuItemStructure[];
    initializeMenuDropdown(primaryDropdownList: Array<any>): Array<any>[];
}