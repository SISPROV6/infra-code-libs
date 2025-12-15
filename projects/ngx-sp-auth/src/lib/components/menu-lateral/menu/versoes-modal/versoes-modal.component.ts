import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { InfraModule } from 'ngx-sp-infra';

import { RouterLink } from '@angular/router';
import { AuthUtilService } from '../../../../utils/auth-utils.service';
import { MenuServicesService } from '../../menu-services.service';

@Component({
  selector: 'versoes-modal',
  templateUrl: './versoes-modal.component.html',
  imports: [
    InfraModule,
    RouterLink,
    CommonModule,
  ],
  styles: `
    ul {
      list-style-type: none !important;
    }
  `,
})
export class VersoesModalComponent implements OnInit {

  constructor(
    private _menuService: MenuServicesService,
    private _authUtils: AuthUtilService
  ) { }

  ngOnInit(): void {
    this.getVersions();
  }


  // #region ==========> PROPERTIES <==========

  // #region PUBLIC
  @Output() public onClose = new EventEmitter<any>();
  
  public versionBase: string = '';
  public versionCorporativo: string = '';

  public versions?: any[];

  public get releaseNotesUrl(): string {
    let url: string = '';

    if (window.location.host === 'localhost:4200') url = "https://siscandesinfra.sispro.com.br/SisproErpCloud/V6ReleaseNotes";
    else url = `https://${window.location.host}/SisproErpCloud/V6ReleaseNotes`;

    return url;
  }

  public closeSelf = (): void => { this.onClose.emit() }
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> SERVICES <==========

  // #region PREPARATION

  /** Obtém Versão instalada da Infra e dos outros produtos.
   * 
   * Este método receberá no futuro uma lista de Versões de produtos cadastrados e listados em ordem.
  */
  private getVersions(): void {
    this._menuService.getVersionBase().subscribe({
      next: response => this.versionBase = response.Version,
      error: error => this._authUtils.showHttpError(error)
    });

    // Versão do Corporativo
    // TODO: Excluir
    this._menuService.getVersionCorporativo().subscribe({
      next: response => this.versionCorporativo = response.Version,
      error: error => this._authUtils.showHttpError(error)
    });

    // Versão dos Módulos
    this._menuService.getVersionModulos().subscribe({
      next: response => {
        console.log(response);

        this.versions = response.Data;
      },
      error: error => this._authUtils.showHttpError(error)
    });
  }

  // #endregion PREPARATION

  // #endregion ==========> SERVICES <==========


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
