import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { escapeRegExp } from 'lodash';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';
import { ITelaRota } from './models/ITelaRota';

@Component({
  selector: 'lib-search-input, lib-pesquisa-global',
  imports: [
    FormsModule,
    LibIconsComponent,
    TooltipModule
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit, AfterViewInit {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _items: ITelaRota[] = [];
  // #endregion PRIVATE

  // #region PUBLIC
  @Input() public customItems?: ITelaRota[];
  @Input() public showIcons: boolean = false;

  @ViewChild('searchInput') public searchInput!: ElementRef<HTMLInputElement>;

  public isVisible = false;
  public searchQuery = '';
  public filteredItems: ITelaRota[] = [ ...this._items ];
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor(
    private _http: HttpClient,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.loadRoutes();
  }

  ngAfterViewInit(): void {
    if (this.isVisible) this.focusInput();
  }


  // #region ==========> UTILS <==========
  private loadRoutes(): void {
    if (!this.customItems) {
      this._http.get<ITelaRota[]>('assets\/jsons\/routes.json').subscribe(
        data => this._items = data,
        error => console.error('Erro ao buscar as rotas.:', error)
      );
    }
    else {
      this._items = this.customItems;
    }
  }


  @HostListener('document:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'p') {
      event.preventDefault();

      this.isVisible = !this.isVisible;

      if (this.isVisible) setTimeout(() => this.focusInput(), 0);
      else this.resetSearch();
    }
    else if (this.isVisible && event.key === 'Enter') {
      event.preventDefault();

      if (this.filteredItems.length > 0) this.navigateTo(this.filteredItems[0].route);
    }
    else if (event.key === 'Escape') {
      this.closeSearch();
    }
  }


  public navigateTo(route: string): void {
    this._router.navigate([route]);
    this.closeSearch();
  }

  public highlightList(pesquisa: string): void {
    let list = document.querySelector('.options-list')?.querySelectorAll('li');

    // se pesquisa for vazia, remove highlights
    // if (!pesquisa.trim()) {
    //   list?.forEach(li => {
    //     const span = li.querySelector('span.tela') as HTMLElement | null;
    //     const target = span ?? (li as HTMLElement);

    //     // restaura apenas o texto bruto (remove marcações de highlight)
    //     target.innerHTML = target.textContent ?? '';
    //   });
      
    //   return;
    // }

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
  public closeSearch(): void {
    this.isVisible = false;
    this.resetSearch();
  }
  
  public onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredItems = this._items.filter(item =>
        item.label.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      console.log(this.searchQuery);
      console.log(this._items);
      console.log(this.filteredItems);
    }
    else {
      this.filteredItems = [ ...this._items ];
    }
  }

  public resetSearch(): void {
    this.searchQuery = '';
    this.filteredItems = [ ...this._items ];
  }

  private focusInput(): void {
    if (this.searchInput) this.searchInput.nativeElement.focus();
  }
  // #endregion PESQUISA

  // #endregion ==========> UTILS <==========

}
