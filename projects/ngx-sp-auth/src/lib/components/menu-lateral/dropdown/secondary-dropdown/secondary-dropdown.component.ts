import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfraModule } from 'ngx-sp-infra';
import { environment } from '../../../../environments/environments';

// import { ProjectUtilservice } from 'src/app/project/utils/project-utils.service';

@Component({
      selector: 'app-secondary-dropdown',
      templateUrl: './secondary-dropdown.component.html',
      styleUrls: ['./secondary-dropdown.component.scss'],
      standalone: true,
      imports: [
            InfraModule,
            CommonModule
      ],
})
export class SecondaryDropdownComponent implements OnInit {

      @Input() public modulo: any = { id: null, icon: null, label: null, URL: null, secondary_level: null }
            ;
      @Output() public backPrimaryDropdown = new EventEmitter<boolean>();

      constructor() { }

      ngOnInit(): void {
      }

      public backToPrimary() {
            this.backPrimaryDropdown.emit(true);
      }

      public redirectToModulo(modulo: string): void {
            const url: string = `${environment.hostName}/SisproErpCloud/${modulo}`;

            window.open(url, '_blank');
      }

}
