import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'lib-nav-produtos',
    
    template: `

    <ul class="menu">
      <li class="menu-item"
        *ngFor="let item of navItems"
        [class.active]="activeItem === item.caminho"
        >
        <a [routerLink]="item.caminho" target="_blank">{{ item.label }}</a>

        <!-- <a [href]="item.caminho" target="_blank">{{ item.label }}</a> -->
      </li>
    </ul>

  `,
    styleUrls: ['./nav-produtos.component.css'],
    imports: [NgFor, RouterLink]
})
export class NavProdutosComponent implements OnInit {

  @Input() navItems: { caminho: string; label: string }[] = [];

  activeItem: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.activeItem = this.router.url;
  }

}
