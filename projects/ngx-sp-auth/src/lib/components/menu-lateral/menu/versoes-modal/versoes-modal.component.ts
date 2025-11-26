import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { InfraModule } from 'ngx-sp-infra';

import { ProjectUtilservice } from '../../../../project/project-utils.service';
import { MenuServicesService } from '../../menu-services.service';

@Component({
    selector: 'versoes-modal',
    templateUrl: './versoes-modal.component.html',
    styleUrls: ['./versoes-modal.component.scss'],
    imports: [
      InfraModule,
      CommonModule
    ]
})
export class VersoesModalComponent implements OnInit {
  constructor(
    private _menuServicesService: MenuServicesService,
    private _projectUtilService: ProjectUtilservice
  ) { }

  ngOnInit(): void {
    this.getVersions();
  }

  // #region ==========> PROPERTIES <==========

  // #region PUBLIC
  @Output() public onClose = new EventEmitter<any>();
  
  public versionInfra: string = '';
  public versionCorporativo: string = '';

  public get releaseNotesUrl(): string {
    let url: string = '';

    if (window.location.host === 'localhost:4200') url = "https://siscandesinfra.sispro.com.br/SisproErpCloud/V6ReleaseNotes/home";
    else url = `https://${window.location.host}/SisproErpCloud/V6ReleaseNotes/home`;

    return url;
  }
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========

  // #region ==========> SERVICES <==========

  // #region PREPARATION

  private getVersions(): void {
    
    // Obtém Versão da Infra
    this._menuServicesService.getVersionInfra().subscribe({
      next: response => {
        this.versionInfra = response.Version;
      },
      error: error => {
        this._projectUtilService.showHttpError(error);
      }
    })

    // Obtém Versão do Corporativo
    this._menuServicesService.getVersionCorporativo().subscribe({
      next: response => {
        this.versionCorporativo = response.Version;
      },
      error: error => {
        this._projectUtilService.showHttpError(error);
      }
    })

  }

  // #endregion PREPARATION

  // #endregion ==========> SERVICES <==========

  // #region ==========> MODALS <==========

  public closeSelf() {
    this.onClose.emit();
  }

  // #endregion ==========> MODALS <==========

}
