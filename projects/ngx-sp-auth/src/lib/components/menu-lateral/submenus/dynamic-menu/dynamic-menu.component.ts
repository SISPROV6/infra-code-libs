import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProjectUtilservice } from '../../../../project/project-utils.service';
import { IMenuItemStructure } from '../../model/imenu-item-structure.model';

@Component({
    selector: 'app-dynamic-menu',
    templateUrl: './dynamic-menu.component.html',
    styleUrls: ['./dynamic-menu.component.scss'],
    imports: [
        // AuthRoutingModule, 
        CommonModule,
        RouterLink
    ]
})
export class DynamicMenuComponent implements OnInit {

  @Output() selectTemplate: EventEmitter<any> = new EventEmitter;

  @Input() submenuRef!: HTMLDivElement;

  @Input() recebeParam!: Function;

  @Input() titleSubmenu = "";

  @Input() submenuList?: IMenuItemStructure[] = [];

  menuList: IMenuItemStructure[] = [];

  menuStatic: IMenuItemStructure[] = [];

  selectedMenuItem: number[] = [];

  selectedItem: number = -1;

  @ContentChild(TemplateRef) desiredContent?: TemplateRef<any>;

  constructor(public router: Router,
    private _projectUtilService: ProjectUtilservice
  ) { }

  ngOnInit(): void { }

  onClickedOutside(e: Event, ref: HTMLDivElement) {
    ref.classList.remove("opened-sub");
    this.submenuList = [];
    this.indicateSelectedMenuItem();
  }

  indicateSelectedMenuItem() {
    if (this.selectedMenuItem.length) {
      this.selectedItem = this.selectedMenuItem[0];
    }
  }

  changeStar(ref: HTMLButtonElement, id: IMenuItemStructure | undefined) {
    ref.classList.toggle("star");
    ref.classList.toggle("yellow-star");
  }

  public getExternalUrl(url: string) {
    return `${ this._projectUtilService.getHostName() }/${ url }`;
 }
   
}
