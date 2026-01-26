import { Component, Input, OnInit } from '@angular/core';

import { LibIconsComponent } from 'ngx-sp-infra';

import { RouterLink } from "@angular/router";
import { MenuServicesService } from '../../components/menu-lateral/menu-services.service';
import { LibCustomEnvironmentService } from '../../custom/lib-custom-environment.service';
import { AuthUtilService } from '../../utils/auth-utils.service';

export class NavSubmenuCards {
  titulo: string = '';
  icon: string = '';
  descricao: string = '';
  urlPath: string = '';
  isExternal: boolean = false;
  is_OutroModulo: boolean = false;
}

@Component({
  selector: 'sub-menu-card, lib-submenu-card',
  imports: [
    LibIconsComponent,
    RouterLink
  ],
  template: `
    <div class="max-card-menu row">
      @for(card of subMenuCards; track $index) {
        @if (card.isExternal || card.is_OutroModulo) {
          <a [href]="getExternalUrl(card.urlPath, card.is_OutroModulo)" target="_blank" class="card-link col-4">
            <div class="card w-100 border-0 rounded text-center glb-cursor-pointer">
              <div class="card-icon">
                <div class="card-icon2">
                  <lib-icon class="bold" [iconName]="card.icon ? card.icon : 'engrenagem'" iconColor="blue" [iconSize]="35" />
                </div>
              </div>

              <h3 class="card-title">{{ card.titulo }}</h3>
              <p class="card-text" [title]="card.descricao"> {{ card.descricao }} </p>
            </div>
          </a>
        }
        @else {
          <a [routerLink]="[ '/'+card.urlPath ]" class="card-link col-4">
            <div class="card w-100 border-0 rounded text-center glb-cursor-pointer">
              <div class="card-icon">
                <div class="card-icon2">
                  <lib-icon class="bold" [iconName]="card.icon ? card.icon : 'engrenagem'" iconColor="blue" [iconSize]="35" />
                </div>
              </div>

              <h3 class="card-title">{{ card.titulo }}</h3>
              <p class="card-text" [title]="card.descricao"> {{ card.descricao }} </p>
            </div>
          </a>
        }
      }
    </div>
  `,
  styleUrl: './sub-menu-card.component.scss'
})
export class SubMenuCardComponent implements OnInit {

  // #region ==========> PROPERTIES <==========

  // #region PUBLIC
  @Input() subMenuCards: NavSubmenuCards[] = [];

  public hostName:string = "";

  public getExternalUrl = (url: string, isOutroModulo:boolean): string => { return (isOutroModulo? `${ this.hostName }/SisproErpCloud/${ url }`: `${ this.hostName == "" ? `https://${ window.location.host }` : this.hostName }/${ url }`) }
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor(
    private _menuService: MenuServicesService,
    private _authUtilService: AuthUtilService,

    private _customEnv: LibCustomEnvironmentService
  ) { }

  ngOnInit(): void {
    this.GetHostName();
  }


  // #region ==========> API METHODS <==========

  // #region GET

  public GetHostName() {
    // Validação adicionada para ignorar esta chamada caso o componente seja exibido na docs
    if (this._customEnv.product === "InfraCodeDocs") return;

    this._menuService.GetHostServerOutSystems().subscribe({
      next:response => this.hostName = response.String,
      error:error => this._authUtilService.showHttpError(error)
    })
  }

  // #endregion GET

  // #endregion ==========> API METHODS <==========


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
