import { IError } from "ngx-sp-infra";
import { NavSubmenuCards, NavSubMenus } from "../../../../public-api";

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
