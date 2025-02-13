import { ISubmenuItemStructure } from './isubmenu-item-structure.model';

/** Interface que define a estrutura de um item de menu. */
export interface IMenuItemStructure {
   id: number;
   label: string;
   descricao: string;
   icon: string;
   route: string;
   isExternal: boolean;
   isSelected: boolean;

   children?: ISubmenuItemStructure[];
}
