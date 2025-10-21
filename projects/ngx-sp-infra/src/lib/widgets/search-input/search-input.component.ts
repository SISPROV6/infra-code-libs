import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { escapeRegExp } from 'lodash';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { LibIconsComponent } from '../lib-icons/lib-icons.component';
import { LibSpinnerComponent } from "../spinner/spinner.component";
import { ITelaRota } from './models/ITelaRota';

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
  private _items?: ITelaRota[];
  // #endregion PRIVATE

  // #region PUBLIC
  @Input() public showIcons: boolean = false;

  @Output() public onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onSearch: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('searchInput') public searchInput!: ElementRef<HTMLInputElement>;

  public searchQuery = '';
  public filteredItems?: ITelaRota[];

  public get items(): ITelaRota[] | undefined { return this._items }
  public set items(value: ITelaRota[]) {
    this._items = value;
    this.filteredItems = [ ...this._items ];
  }
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
    // if (event.ctrlKey && event.key === 'p') {
    //   event.preventDefault();

    //   this.isVisible = !this.isVisible;

    //   if (this.isVisible) setTimeout(() => this.focusInput(), 0);
    //   else this.resetSearch();
    // }
    if (event.key === 'Escape') {
      this.close();
    }
  }


  public navigateTo(route: string): void {
    this._router.navigate([route]).then(() => this.close() );
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
