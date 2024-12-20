import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// #region EXPORT CLASSES
export class Params {
  paramName: string = '';
  paramValue: string = '';
}

export class NavItem {
  caminho: string = '';
  label: string = '';
  params?: Params[];
  isTargetSelf?: boolean;
}
// #endregion EXPORT CLASSES

/**
 * @description Componente que exibe opções de navegação entre produtos.
 * O usuário precisa apenas informar quais são as opções de navegação e o componente se encarrega de exibir.
 * 
 * @param navItems Lista de itens de navegação que serão exibidos. Cada NavItem tem a seguinte estrutura:
 * ```typescript
 * export class NavItem {
 *    caminho: string = '';
 *    label: string = '';
 *    params?: Params[];
 *    isTargetSelf?: boolean;
 * }
 * ```
 * 
 * @param isProduction Indica se o ambiente é de produção ou não. Dentro dos projetos, deve ser buscado do arquivo 'environment'.
 * @param hostname Hostname do ambiente atual ou de produção (depende do que foi informado na isProduction).
 * 
 * @example ```html
 * <lib-nav-produtos [navItems]="[
 *    {caminho: '/SisproErpCloud/Corporativo/empresas/editar/' + this.infraEmpresaID , label: 'Empresa' },
 *    {caminho: '/SisproErpCloud/Contabilidade/perfilDaEmpresa', params: [ {paramName :'InfraEmpresaId', paramValue : infraEmpresaID} ] , label: 'Contábil'  },
 *    {caminho: '/SisproErpCloud/Corporativo/home' , label: 'Estoque'  },
 * ]"></lib-nav-produtos>
 * ```
 */
@Component({
  selector: 'lib-nav-produtos',
  template: `
    <ul class="menu">
      @for (item of navItems; track $index) {
      <li class="menu-item" [class.active]="activeItem === item.caminho">
        <a class="glb-cursor-pointer" (click)="onNavigate(item)" (keydown.enter)="onNavigate(item)" [tabindex]="$index" >{{ item.label }}</a>
      </li>
      }
    </ul>
  `,
  styleUrl: './lib-nav-produtos.component.scss',
})
export class LibNavProdutosComponent implements OnInit {
  // #region ==========> PROPERTIES <==========

  // #region PUBLIC

  /** Lista de itens de navegação que serão exibidos */
  @Input() navItems: NavItem[] = [];

  /** Indica se o ambiente é de produção ou não. Dentro dos projetos, deve ser buscado do arquivo 'environment'. */
  @Input() isProduction: boolean = false;

  /** Hostname do ambiente atual ou de produção (depende do que foi informado na isProduction). */
  @Input() hostname: string = "localhost:4200";

  public activeItem: string = '';
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========

  // #region ==========> INITIALIZATION <==========
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.activeItem = this.router.url;
  }
  // #endregion ==========> INITIALIZATION <==========

  // #region ==========> UTILS <==========
  public onNavigate(item: NavItem, isProduction: boolean = false, hostName: string = 'localhost:4200'): void {
    const route: string =
      item.params != undefined && item.params!.length > 0
        ? item.caminho + this.normalizeParams(item.params)
        : item.caminho;

    let url: string = route;

    if (!isProduction) {
      const urlArr: string[] = route.split('/');

      urlArr.splice(0, 3);
      url = urlArr.join('/');
    }
    else {
      url = `${hostName}` + route;
    }

    window.open(url, item.isTargetSelf ? '_self' : '_blank');
  }

  public normalizeParams(params: Params[] | undefined): string {
    if (params != undefined) {
      let urlString = '?';

      for (let index = 0; index < params.length; index++) {
        urlString += params[index].paramName + '=' + params[index].paramValue;

        if (index != params.length - 1) urlString += '&';
      }

      return urlString;
    }
    else return '';
  }
  // #endregion ==========> UTILS <==========
}
