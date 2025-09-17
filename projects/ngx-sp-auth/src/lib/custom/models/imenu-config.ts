import { IMenuItemStructure } from "../../components/menu-lateral/model/imenu-item-structure.model";

export interface IMenuConfig {

    //Métodos menuconfig
    initializeMenu(currentRoute: string, customList?: IMenuItemStructure[]): IMenuItemStructure[];
    
    setMenuType(isStaticMenu: boolean): void;

    updateRouteSelection(currentRoute: string, currentList: IMenuItemStructure[]): IMenuItemStructure[];
}