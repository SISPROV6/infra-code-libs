import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @Input() public showIcons: boolean = false;

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


  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
    // 
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }


  // #region ==========> UTILS <==========

  @HostListener('document:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }


  public navigateTo(route: string): void {
    this._router.navigate([route]).then(() => this.close() );
  }

  public redirect(item: IV6Tela | IV6Submenu | IV6Menu): void {
    const hostname = window.location.host.includes("localhost") ? "siscandesv6.sispro.com.br" : window.location.host;
    const baseURL = `https://${hostname}/SisproErpCloud`;

    if (item.RotaV6 && item.RotaV6 !== '') {
      let isCorporativo = item.RotaV6.split('/')[0] != item.Projeto;
      console.log('item:', item);
      console.log('isCorporativo:', isCorporativo);
      
      const targetRoute = `${baseURL}/${ isCorporativo ? 'Corporativo/' : '' }${item.RotaV6}`;
      console.log('targetRoute:', targetRoute);
      
      window.location.replace(targetRoute);
    }
    else {
      // Se a RotaOS começar com '/', não adiciona outra '/'
      const targetRoute = `${baseURL}${ item.RotaOS[0] === '/' ? '' : '/' }${item.RotaOS}`;
      window.location.replace(targetRoute);
    }
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