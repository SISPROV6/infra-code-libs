/** Interface que define a estrutura de um item de menu. */
export interface ISubmenuItemStructure {
   id: number;
   label: string;
   descricao: string;
   route: string;
   isExternal: boolean;
   isSelected: boolean;
}
