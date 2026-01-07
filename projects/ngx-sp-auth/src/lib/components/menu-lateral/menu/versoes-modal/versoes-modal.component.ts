import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { InfraModule } from 'ngx-sp-infra';

import { AuthUtilService } from '../../../../utils/auth-utils.service';
import { MenuServicesService } from '../../menu-services.service';
import { GrupoProjeto } from '../../model/VersoesByGrupo.model';

@Component({
  selector: 'versoes-modal',
  templateUrl: './versoes-modal.component.html',
  imports: [
    CommonModule,
    InfraModule,
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
  
  public versionBase?: string;
  public versions?: GrupoProjeto[];

  public get releaseNotesUrl(): string {
    let url: string = '';

    if (window.location.host.includes('localhost') || window.location.host.includes('siscandesinfra')) url = "https://siscandesinfra.sispro.com.br/SisproErpCloud/V6ReleaseNotes";
    else url = `https://erpsrvv6.sisprocloud.com.br/SisproErpCloud/V6ReleaseNotes`;

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
      next: response => this.versionBase = response.Data!,
      error: error => this._authUtils.showHttpError(error)
    });

    // Versão dos Módulos
    this._menuService.getVersionModulos().subscribe({
      next: response => {
        console.log(response);

        // Deve formatar as versões que forem 0 converter para "Base"
        this.versions = this.formatVersions(response.Data ?? []);
      },
      error: error => this._authUtils.showHttpError(error)
    });
  }

  // #endregion PREPARATION

  // #endregion ==========> SERVICES <==========


  // #region ==========> UTILS <==========
  
  /**
   * Formata as "versões" de cada registro da lista para que caso estejam vazios, zerados ou nulos retornem "Base" para ficar mais legível.
   * 
   * @param list Lista a ser formatada
   * @returns Lista após processod e formatação correto
  */
  private formatVersions(list: GrupoProjeto[]): GrupoProjeto[] {
    if (!list) return [];

    list = list.map(g => {
      if (!g.projetos) {
        g.versao = g.versao === '' || g.versao === '0' ? "Base" : g.versao;
        return g;
      }
      else {
        g.projetos = g.projetos.map(p => {
          if (p.versao === '' || p.versao === '0') p.versao = "Base";
          return p;
        })

        return g;
      }
    });

    return list;
  }

  // #endregion ==========> UTILS <==========

}
