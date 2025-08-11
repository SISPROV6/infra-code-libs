import { IError } from "ngx-sp-infra";

import { IMenuItemStructure } from "./imenu-item-structure.model";
import { ISubmenuItemStructure } from "./isubmenu-item-structure.model";

export class RetDynamicMenu implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    MenuSubmenu!: DynamicMenu[];
}

export class DynamicMenu implements IMenuItemStructure{
    id: number = 0;
    label: string = "";
    descricao: string= "";
    icon: string= "";
    route: string= "";
    isExternal: boolean = false;
    isSelected: boolean = false;
    children?: ISubmenuItemStructure[] | undefined;
}
