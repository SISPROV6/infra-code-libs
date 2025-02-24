
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
//import { environment } from '../../../../environments/environments';
// import { ProjectUtilservice } from 'src/app/project/utils/project-utils.service';

@Component({
      selector: 'app-secondary-dropdown',
      templateUrl: './secondary-dropdown.component.html',
      styleUrls: ['./secondary-dropdown.component.scss'],
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
            const url: string = `https://siscandesv6.sispro.com.br/SisproErpCloud/${modulo}`;

            window.open(url, '_blank');
      }

}
