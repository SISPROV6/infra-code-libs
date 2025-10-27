import { IError, MenuSubmenuTela } from 'ngx-sp-infra';

export class RetTelasPesquisa implements IError {
  Error: boolean = false;
  ErrorMessage: string = "";

  MenuSubmenuTela: MenuSubmenuTela = new MenuSubmenuTela();
}