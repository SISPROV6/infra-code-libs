import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import { CustomMenuService } from '../../../../custom/custom-menu.service';
//import { ProjectUtilservice } from 'src/app/project/utils/project-utils.service';
import { environment } from '../../../../environments/environments';
import { SecondaryDropdownComponent } from '../secondary-dropdown/secondary-dropdown.component';

@Component({
      selector: 'app-primary-dropdown',
      templateUrl: './primary-dropdown.component.html',
      styleUrls: ['./primary-dropdown.component.scss'],
      standalone: true,
      imports: [
            SecondaryDropdownComponent,
            CommonModule
      ],
})
export class PrimaryDropdownComponent implements OnInit {

      public selectDataState!: boolean;
      public modulo: any;


      //propriedades que vão receber dados do customMenuService




      @Input() buttonWasClicked: Observable<boolean> = new Observable;

      public primaryDropdown: Array<any> = [
      ]

      constructor(
            private _customMenuService: CustomMenuService,
            //private _projectUtilservice: ProjectUtilservice
      ) { }

      ngOnInit(): void {
            this.buttonWasClicked.subscribe(() => { this.selectDataState = true });

            // Resolver colisão de eventos
            if (this._customMenuService.menuDynamic) {

                  if (!this._customMenuService.menuConfig) {
                        setTimeout(() => {
                              this.primaryDropdown = this._customMenuService.menuConfig.initializeMenuDropdown(this.primaryDropdown);
                        }, 2000);
                  } else {
                        this.primaryDropdown = this._customMenuService.menuConfig.initializeMenuDropdown(this.primaryDropdown);
                  }

            } else {
                  this.primaryDropdown = this._customMenuService.menuConfig.initializeMenuDropdown(this.primaryDropdown);
            }

      }

      public openDropdown(modulo: any, desiredDropdown: TemplateRef<any>) {
            this.modulo = modulo;

            if (desiredDropdown == null) {
                  this.selectDataState = true;
            } else {
                  this.selectDataState = false;
            }
      }

      public onClickedOutside(e: Event, ref: HTMLDivElement) {
            if (this.selectDataState = false) {
                  this.selectDataState = true;
            }
      }

      public backToPrimary(data: boolean) {
            this.selectDataState = true;
      }

      public redirectToPrePortal(): void {
            const url: string = `${environment.hostName}/SisproErpCloud/PrePortal`;

            window.open(url, '_blank');
      }

      public redirectToModulo(modulo: string): void {
            const url: string = `${environment.hostName}/SisproErpCloud/${modulo}`;

            window.open(url, '_blank');
      }

}
