import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfraModule } from 'ngx-sp-infra';

import { ProjectUtilservice } from '../../../../project/project-utils.service';

@Component({
    selector: 'app-secondary-dropdown',
    templateUrl: './secondary-dropdown.component.html',
    styleUrls: ['./secondary-dropdown.component.scss'],
    imports: [
        InfraModule,
        CommonModule
    ]
})
export class SecondaryDropdownComponent implements OnInit {

      @Input() public modulo: any = { id: null, icon: null, label: null, URL: null, secondary_level: null }
      ;
      @Output() public backPrimaryDropdown = new EventEmitter<boolean>();

      constructor(private _projectUtilservice: ProjectUtilservice) { }

      ngOnInit(): void {
      }

      public backToPrimary() {
            this.backPrimaryDropdown.emit(true);
      }

      public redirectToModulo(modulo: string): void {
            const url: string = `${ this._projectUtilservice.getHostName() }/SisproErpCloud/${ modulo }`;

            window.open(url, '_blank');
      }

}
