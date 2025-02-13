import { IMenuItemStructure } from "../../components/menu-lateral/model/imenu-item-structure.model";

export interface IMenuConfig {
    menuOptions: IMenuItemStructure[];
    isMenuStatic: boolean; 
    initializeMenu(currentRoute: string, customList?: IMenuItemStructure[]): IMenuItemStructure[];
    initializeMenuDropdown(primaryDropdownList: Array<any>): Array<any>[];
}