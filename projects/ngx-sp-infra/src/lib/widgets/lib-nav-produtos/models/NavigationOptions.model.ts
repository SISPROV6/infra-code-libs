import { NavItem } from "../lib-nav-produtos.component";

/** Propriedades agrupadas para utilizar com o componente ```<lib-navigation>``` */
export class NavigationOptions {
  /** Lista de itens de navegação que serão exibidos */
  public navItems: NavItem[] = [];

  /** Indica se o ambiente é de produção ou não. Dentro dos projetos, deve ser buscado do arquivo 'environment'. */
  public isProduction: boolean = true;

  /** Hostname do ambiente atual ou de produção (depende do que foi informado na isProduction). */
  public hostname: string = "https://siscandesv6.sispro.com.br";
}