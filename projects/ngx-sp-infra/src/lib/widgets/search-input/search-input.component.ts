import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { escapeRegExp } from 'lodash';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { LibIconsComponent } from '../lib-icons/lib-icons.component';
import { LibSpinnerComponent } from "../spinner/spinner.component";

import { IV6Menu } from './models/IV6Menu.model';
import { IV6Submenu } from './models/IV6Submenu.model';
import { IV6Tela } from './models/IV6Tela.model';

@Component({
  selector: 'lib-search-input, lib-pesquisa-global',
  imports: [
    FormsModule,
    LibIconsComponent,
    TooltipModule,
    LibSpinnerComponent
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit, AfterViewInit {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _menus?: IV6Menu[] = [];
  private _submenus?: IV6Submenu[] = [];
  private _telas?: IV6Tela[] = [];
  // #endregion PRIVATE

  // #region PUBLIC
  @Output() public onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onSearch: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('searchInput') public searchInput!: ElementRef<HTMLInputElement>;

  public searchQuery = '';
  public loading: boolean = false;

  // #region GETTERS & SETTERS
  public filteredTelas?: IV6Tela[] = [];
  public filteredSubmenus?: IV6Submenu[] = [];
  public filteredMenus?: IV6Menu[] = [];

  public get menus(): IV6Menu[] | undefined { return this._menus }
  public set menus(value: IV6Menu[]| undefined) {
    this._menus = value;
    this.filteredMenus = [ ...this._menus ?? [] ];
  }

  public get submenus(): IV6Submenu[] | undefined { return this._submenus }
  public set submenus(value: IV6Submenu[]| undefined) {
    this._submenus = value;
    this.filteredSubmenus = [ ...this._submenus ?? [] ];
  }

  public get telas(): IV6Tela[] | undefined { return this._telas }
  public set telas(value: IV6Tela[]| undefined) {
    this._telas = value;
    this.filteredTelas = [ ...this._telas ?? [] ];
  }
  // #endregion GETTERS & SETTERS

  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor( private _router: Router ) { }

  ngOnInit(): void {
    // 
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  @HostListener('document:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }


  public redirect(item: IV6Tela | IV6Submenu | IV6Menu): void {
    // Decide which route to use: prefer RotaV6, otherwise RotaOS
    const routeToUse = (item.RotaV6 && item.RotaV6 !== '') ? item.RotaV6 : item.RotaOS;
    const targetRoute = this.formatBaseURL(item, routeToUse);

    // For debugging: log the computed URL. Navigation is intentionally commented out.
    window.location.assign(targetRoute);
  }


  public highlightList(pesquisa: string): void {
    const list = document.querySelector('.options-list')?.querySelectorAll('li');
    const regex = new RegExp(escapeRegExp(pesquisa), 'ig');

    list?.forEach((li) => {
      const span = li.querySelector('span.tela') as HTMLElement | null;
      const target = span ?? (li as HTMLElement);
      const text = target.textContent ?? '';

      // substitui as ocorrências por um elemento de destaque (p.ex. <mark>)
      const highlighted = text.replace(regex, (match) => `<b style="color: #ebae00;">${match}</b>`);
      target.innerHTML = highlighted;
    });
  }


  // FORMATAÇÃO DA ROTA

  /**
   * Formata a string de rota para usar no redirecionamento, pode ser OS ou V6.
   * 
   * @param item Objeto selecionado da lista
   * @param route Rota desejada (OS ou V6)
   * @returns String formatada com a rota final
   * 
   * * O método foi fortemente modificado pelo Github Copilot para rastrear todos os cenários
  */
  private formatBaseURL(item: IV6Tela | IV6Submenu | IV6Menu, route: string): string {
    // Return full target URL according to these scenarios:
    // - local + RotaV6  => http(s)://localhost:PORT/<rotaReduzida>
    // - local + RotaOS  => https://<productionHost>/<rotaOS>
    // - server + RotaV6 => https://<serverHost>/<rotaV6>
    // - server + RotaOS => https://<serverHost>/<rotaOS>

    // Normalize route and item fields
    const routeStr = route || '';
    const isLocal = window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1';

    // Production host to use when we need to redirect to server from local
    const productionHost = isLocal ? 'siscandesv6.sispro.com.br' : window.location.host;
    
    const protocol = window.location.protocol;
    const host = window.location.host;

    // Helper to remove diacritics / accents
    const normalizarString = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Determine if given route corresponds to a V6 route (it will match item.RotaV6)
    const isV6 = item.RotaV6 && routeStr === item.RotaV6;
    const isOS = item.RotaOS && routeStr === item.RotaOS;

    const primeiroSegmentoRota = routeStr.split('/')[0] || '';
    const nomeProjetoRota = normalizarString(primeiroSegmentoRota || '');

    // If the first segment of the route equals the project name, we may remove it for local V6 routing
    const primeiroSegmentoIsProjeto = item.ProjetoURLHome !== '' && item.ProjetoURLHome === nomeProjetoRota;

    // Build final URL
    let finalURL = '';

    if (isV6) {
      if (isLocal) {
        // On local, route should point to the local app. Remove first segment when it's the project name.
        const rotaReduzida = primeiroSegmentoIsProjeto && routeStr.includes('/') ? routeStr.split('/').slice(1).join('/') : routeStr;
        finalURL = `${protocol}//${host}/${rotaReduzida.replace(/^\/+/, '')}`;
      }
      else {
        // On server, use the server host and keep the full V6 route
        // If the route doesn't start with a product name, it's a Corporativo route
        const isCorporativo = !primeiroSegmentoIsProjeto;
        finalURL = `https://${host}/SisproErpCloud/${isCorporativo ? 'Corporativo/' : ''}${routeStr.replace(/^\/+/, '')}`;
      }
    }
    else if (isOS) {
      // RotaOS always points to the server (production) using https
      finalURL = `https://${productionHost}/${routeStr.replace(/^\/+/, '')}`;
    }
    else {
      // Fallback: if route is empty or not matched, return current origin
      finalURL = `${protocol}//${host}`;
    }

    return finalURL;
  }


  // #region PESQUISA
  public close(): void {
    this.onClose.emit();
    this.resetSearch();
  }
  
  public search(): void {
    // TODO: Implementar o highlight mesmo com o filtro externo
    // this.highlightList(this.searchQuery.trim());
    this.onSearch.emit(this.searchQuery.trim());
  }

  public resetSearch(): void {
    this.searchQuery = '';
    this.onSearch.emit('');
  }

  private focusInput(): void {
    if (this.searchInput) this.searchInput.nativeElement.focus();
  }
  // #endregion PESQUISA

  // #endregion ==========> UTILS <==========

}