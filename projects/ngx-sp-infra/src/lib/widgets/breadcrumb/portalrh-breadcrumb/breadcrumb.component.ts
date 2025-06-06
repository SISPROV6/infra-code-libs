import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-breadcrumb, lib-portalrh-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css'],
    standalone: true
})
export class BreadcrumbComponent implements OnInit {
  
  @Input() menu: string = '';
  @Input() opcao: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
