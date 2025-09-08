import { Component, Input, OnInit } from '@angular/core';
import { LibIconsComponent } from 'ngx-sp-infra';
import { MenuServicesService } from '../../../public-api';
import { ProjectUtilservice } from '../../project/project-utils.service';

export class NavSubmenuCards {
  titulo: string = '';
  icon: string = '';
  descricao: string = '';
  urlPath: string = '';
  isExternal:boolean = false;
};

@Component({
  selector: 'sub-menu-card',
  imports: [LibIconsComponent],
  template: `
    <div class="max-card-menu row">
      @for(card of subMenuCards; track $index) {
        <a href="{{ card.isExternal ? GetExternalUrl(card.urlPath) : card.urlPath }}" class="card-link col-4" target="_blank">
          <div class="card">
            <div class="card-icon">
              <div class="card-icon2">
                <lib-icon
                  class="bold"
                  iconName="{{ card.icon ? card.icon : 'engrenagem'}}"
                  iconColor="blue"
                  [iconFill]="true"
                  [iconSize]="35"
                ></lib-icon>
              </div>
            </div>
            <h3 class="card-title">{{ card.titulo }}</h3>
            <p class="card-text" title="{{ card.descricao }}">
              {{ card.descricao }}
            </p>
          </div>
        </a>
      }
    </div>
  `,
  styleUrl: './sub-menu-card.component.scss',
  standalone: true
})
export class SubMenuCardComponent implements OnInit {
GetExternalUrl(url: string) {
    return `${ this.hostName == "" ? `https://${ window.location.host }` : this.hostName }/${ url }`;

}

ngOnInit(): void {
  this.GetHostName();
}

/**
 *
 */
constructor(private _menuService:MenuServicesService, private _projectUtil:ProjectUtilservice){}


public hostName:string = "";

@Input() subMenuCards: NavSubmenuCards[] = [];


public GetHostName() {
  this._menuService.GetHostServerOutSystems().subscribe({
    next:response => this.hostName = response.String,
    error:error => this._projectUtil.showHttpError(error)
  })
}


}

