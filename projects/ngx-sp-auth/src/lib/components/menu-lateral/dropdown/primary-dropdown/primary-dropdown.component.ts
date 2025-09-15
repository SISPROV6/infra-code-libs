import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import { InfraModule } from 'ngx-sp-infra';

import { LibCustomMenuService } from '../../../../custom/lib-custom-menu.service';
import { ProjectUtilservice } from '../../../../project/project-utils.service';
import { SecondaryDropdownComponent } from '../secondary-dropdown/secondary-dropdown.component';
import { MenuServicesService } from '../../menu-services.service';
import { IProjeto } from '../../model/iprojeto';

@Component({
    selector: 'app-primary-dropdown',
    templateUrl: './primary-dropdown.component.html',
    styleUrls: ['./primary-dropdown.component.scss'],
    imports: [
        SecondaryDropdownComponent,
        CommonModule,
        InfraModule
    ]
})
export class PrimaryDropdownComponent implements OnInit {

      public selectDataState: boolean = false;
      public modulo: any;

      @Input() buttonWasClicked!: Observable<boolean>;

      public primaryDropdown: Array<any> = [
      ]

      constructor(private _customMenuService: LibCustomMenuService,
                  private _projectUtilservice: ProjectUtilservice,
                  private _menuServices: MenuServicesService
      ) { }

      ngOnInit(): void {
            this.buttonWasClicked.subscribe(() => { this.selectDataState = true });
 
            // Resolver colisão de eventos
            if (this._customMenuService.menuDynamic || this._customMenuService.menuDynamicCustom) {

                  if (!this._customMenuService.menuConfig) {
                        setTimeout(() => {
                              this.getProjects();
                        }, 2000);
                  } else {
                        this.getProjects();
                  }
 
            } else {
                  this.getProjects();
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
            const url: string = `${ this._projectUtilservice.getHostName() }/SisproErpCloud/PrePortal`;

            window.open(url, '_blank');
      }

      public redirectToModulo(urlModulo: string): void {
            let url = `${ this._projectUtilservice.getHostName() }/SisproErpCloud`;
            url += urlModulo.startsWith('/') ? urlModulo : '/' + urlModulo

            window.open(url, '_blank');
      }

      /** Inicializa as opções do menu dropdown.
      * @returns As opções do dropdown inicializadas.
      */
      public getProjects(): void {
            this._menuServices.getProjects().subscribe({
                  next: response => {
                        this.primaryDropdown = this.initializeMenuDropdown(response.Dropdown)
                  }, error: error => {
                        this.primaryDropdown = [];
                  }
            })

      }

      public initializeMenuDropdown(projects: IProjeto[]): Array<any> {

            let primaryDropdownList: Array<any> = [];

            for (let project of projects) {

                  if (project.Produtos.length == 0)
                  {
                        primaryDropdownList.push({ id: project.IdUnico, icon: project.Icon, label: project.Nome, URL: project.UrlHome, secondary_level: null });
                  } else {
                        let productList: Array<any> = [];
                        let id = project.IdUnico * 100;

                        for (let product of project.Produtos) {
                              id++;

                              productList.push({ id: id, icon: product.Icon, label: product.Nome, URL: product.UrlHome });
                        }            
            
                        primaryDropdownList.push({ id: project.IdUnico, icon: project.Icon, label: project.Nome, URL: '', secondary_level: productList });
                  }
          
            }            

            /*
            { id: 1, icon: 'assets/icons/sispro/corporativo.svg', label: 'Corporativo', URL: 'Corporativo', secondary_level: null },
            { id: 2, icon: 'assets/icons/sispro/contratos.svg', label: 'Contratos', URL: 'Contratos', secondary_level: null },
            { id: 3, icon: 'assets/icons/sispro/fiscal.svg', label: 'Fiscal', URL: 'Fiscal', secondary_level: null },
            { id: 4, icon: 'assets/icons/sispro/contabilidade.svg', label: 'Contabilidade', URL: 'Contabilidade', secondary_level: null },
            { id: 5, icon: 'assets/icons/sispro/recursos-humanos.svg', label: 'Recursos Humanos', URL: '',
                  secondary_level: [
                  { id: 201, icon: 'assets/icons/sispro/recursos-humanos.svg', label: 'Folha de Pagamento', URL: 'Folha' },
                  { id: 202, icon: 'assets/icons/sispro/recursos-humanos.svg', label: 'eSocial', URL: 'eSocial' },
                  { id: 203, icon: 'assets/icons/sispro/recursos-humanos.svg', label: 'Workflow', URL: 'Workflow' },
                  { id: 204, icon: 'assets/icons/sispro/recursos-humanos.svg', label: 'PortalRh', URL: 'PortalRh' },
                  { id: 205, icon: 'assets/icons/sispro/recursos-humanos.svg', label: 'Rh Básicos', URL: 'RhBase' }
                  ]
            },
            { id: 6, icon: 'assets/icons/sispro/financeiro.svg', label: 'Financeiro', URL: 'Financeiro', secondary_level: null },
            { id: 7, icon: 'assets/icons/sispro/suprimentos.svg', label: 'Suprimentos', URL: '',
                  secondary_level: [
                  { id: 701, icon: 'assets/icons/sispro/suprimentos.svg', label: 'Compras', URL: 'Compras' },
                  { id: 702, icon: 'assets/icons/sispro/suprimentos.svg', label: 'Recebimento', URL: 'Recebimento' },
                  { id: 703, icon: 'assets/icons/sispro/suprimentos.svg', label: 'Estoque', URL: 'Estoque' }
            ]
            },
            { id: 8, icon: 'assets/icons/sispro/vendas.svg', label: 'Negociação', URL: 'Vendas', secondary_level: null },
            { id: 9, icon: 'assets/icons/sispro/patrimonio.svg', label: 'Patrimônio', URL: 'Patrimonio', secondary_level: null }
            */

            return primaryDropdownList;
      }

}
