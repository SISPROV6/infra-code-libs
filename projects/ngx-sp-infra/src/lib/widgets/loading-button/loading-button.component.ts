import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading-button, lib-loading-button',
    template: `
    <img class="button-spinner" src="assets/imgs/spinner.gif" *ngIf="isLoading">
  `,
    styles: `
    .button-spinner{ width: 24px; }
  `,
    
    imports: [NgIf]
})
export class LoadingButtonComponent {
  @Input() isLoading?: boolean;

  constructor() { }

}
