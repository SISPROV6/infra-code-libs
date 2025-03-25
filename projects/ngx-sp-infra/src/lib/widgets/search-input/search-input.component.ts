import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-search-input',
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent implements OnInit, AfterViewInit {
  isVisible = false;
  searchQuery = '';
  
  items: { label: string, route: string }[] = [];
  
  filteredItems = [...this.items];

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  ngAfterViewInit(): void {
    if (this.isVisible) {
      this.focusInput();
    }
  }

  loadRoutes(): void {
    this.http.get<{ label: string, route: string }[]>('assets/jsons/routes.json').subscribe(
      data => {
        this.items = data;
      }, error => {
        console.error('Error loading routes:', error);
      });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'p') {
      event.preventDefault();
      this.isVisible = !this.isVisible;
      if (this.isVisible) {
        setTimeout(() => this.focusInput(), 0);
      } else {
        this.resetSearch();
      }
    } else if (this.isVisible && event.key === 'Enter') {
      event.preventDefault();
      if (this.filteredItems.length > 0) {
        this.navigateTo(this.filteredItems[0].route);
      }
    }
  }
  
  closeSearch(): void {
    this.isVisible = false;
    this.resetSearch();
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.filteredItems = [...this.items];
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredItems = this.items.filter(item =>
        item.label.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredItems = [...this.items];
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeSearch();
  }

  private focusInput(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }
}
