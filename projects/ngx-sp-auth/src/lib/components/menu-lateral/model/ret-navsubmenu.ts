import { IError, NavSubmenuCards, NavSubMenus } from "ngx-sp-infra";

export class RetNavSubMenu implements IError{
    Error: boolean= false;
    ErrorMessage: string = "";
    NavSubmenus!: NavSubMenus[];
}

export class RetSubmenuWithCards implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    Submenu!: NavSubmenuCards[];
}
