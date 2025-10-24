import { IError, ITelaRota, IV6Menu, IV6Submenu, IV6Tela } from 'ngx-sp-infra';

export class RetTelasPesquisa implements IError {
  Error: boolean = false;
  ErrorMessage: string = "";

  Telas: ITelaRota[] = [];
  _Telas: IV6Tela[] = [];
  Menus: IV6Menu[] = [];
  Submenus: IV6Submenu[] = [];
}