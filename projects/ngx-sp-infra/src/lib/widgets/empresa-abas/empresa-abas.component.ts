import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { links } from './models/links-record';
import { Router } from '@angular/router';
import { HostOutsystemsServerService } from './host-outsystems-server.service';
import { MessageService } from '../../message/message.service';
import { firstValueFrom } from 'rxjs';
import { ProjetosLicenciadRecord } from './models/ProjetosLicenciadoRecord';


@Component({
  selector: 'lib-empresa-abas',
  imports: [],
  templateUrl: './empresa-abas.component.html',
  styleUrl: './empresa-abas.component.scss'
})
export class EmpresaAbasComponent implements OnInit {

  public hostServerOutsystem = ""
  public linksList: links[] = [];
  @Input() Id: string | number = "";
  @Output() EmpresaId = new EventEmitter<string | number>();

  public activeItem: string = '';
  public hasContabil: boolean = false;
  public hasEstoque: boolean = false;
  public hasCompras: boolean = false;
  public hasRecebimento: boolean = false;
  public hasFiscal: boolean = false;
  public hasPatrimonio: boolean = false;
  public hasAprovacao: boolean = false;
  public hasFinanceiro: boolean = false;
  public hasReinf: boolean = false;
  public hasEcfTax: boolean = false;
  public hasScp: boolean = false;
  public hasEmpresa: boolean = false;

  public isContabilActive: boolean = false;
  public isEstoqueActive: boolean = false;
  public isComprasActive: boolean = false;
  public isRecebimentoActive: boolean = false;
  public isFiscalActive: boolean = false;
  public isPatrimonioActive: boolean = false;
  public isAprovacaoActive: boolean = false;
  public isFinanceiroActive: boolean = false;
  public isReinfActive: boolean = false;
  public isEcfTaxActive: boolean = false;
  public isScpActive: boolean = false;
  public isEmpresaActive: boolean = false;

  public ProjetosLicenciadoList: ProjetosLicenciadRecord[] = [];

  constructor(
    private router: Router,
    private _hostOutsystemsServerService: HostOutsystemsServerService,
    private _messageService: MessageService,
  ) { }

  async ngOnInit() {

    await this.GetProjetosLicenciado();

    this.GetHostServerOutSystems();
    this.activeItem = this.router.url;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['Id'] && changes['Id'].currentValue) {
      this.EmpresaId.emit(this.Id);
    }
  }


  public GetHostServerOutSystems(): void {
    this._hostOutsystemsServerService.GetHostServerOutSystems(0).subscribe({
      next: (response) => {
        this.hostServerOutsystem = response.String;

        if (window.location.host.includes("localhost")) {

          if (this.hasEmpresa) {
            this.linksList.push(
              { nome: 'Empresa', uri: `http://${window.location.host}/empresas/editar/${this.Id}`, isTargetSelf: true, disable: this.isEmpresaActive },
            );
          }

          if (this.hasContabil) {
            this.linksList.push(
              { nome: 'Contábil', uri: `http://${window.location.host}/perfilDaEmpresa?InfraEmpresaId=${this.Id}`, isTargetSelf: false, disable: this.isContabilActive },
            );
          }

          if (this.hasEstoque) {
            this.linksList.push(
              { nome: 'Estoque', uri: `http://${window.location.host}/SpEtq1Etq/EmpresaEstoque/editar/${this.Id}`, isTargetSelf: false, disable: this.isEstoqueActive },
            );
          }

          if (this.hasCompras) {
            this.linksList.push(
              { nome: 'Compras', uri: `http://${window.location.host}/empresa-compras/editar/${this.Id}`, isTargetSelf: false, disable: this.isComprasActive },
            );
          }

          if (this.hasRecebimento) {
            this.linksList.push(
              { nome: 'Recebimento', uri: `http://${window.location.host}/configuracao-empresa/editar/${this.Id}`, isTargetSelf: false, disable: this.isRecebimentoActive },
            );
          }
          
          if (this.hasFiscal) {
            this.linksList.push(
              { nome: 'Fiscal', uri: `http://${window.location.host}/perfil-da-empresa/editar/${this.Id}`, isTargetSelf: false, disable: this.isFiscalActive },
            );
          }
         
          if (this.hasPatrimonio) {
            this.linksList.push(
              { nome: 'Patrimônio', uri: `http://siscandesv10.sispro.com.br/SpPat1Conf/EmpresaPatrimonio.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false, disable: this.isPatrimonioActive },
            );
          }
          
          if (this.hasAprovacao) {
            this.linksList.push(
              { nome: 'Aprovação', uri: `http://${window.location.host}/empresas/editar/aprovacao/${this.Id}`, isTargetSelf: false, disable: this.isAprovacaoActive },
            );
          }
          
          if (this.hasFinanceiro) {
            this.linksList.push(
              { nome: 'Financeiro', uri: `http://${window.location.host}/empresa-estab/editar/empresa/${this.Id}`, isTargetSelf: false, disable: this.isFinanceiroActive },
            );
          }
          
          if (this.hasReinf) {
            this.linksList.push(
              { nome: 'Reinf', uri: `http://siscandesv10.sispro.com.br/SpReinf1Cad/ReinfEmpresa_List.aspx?InfraEmpresaId=${this.Id}&IsCorp=True`, isTargetSelf: false, disable: this.isReinfActive},
            );
          }
          
          if (this.hasEcfTax) {
            this.linksList.push(
              { nome: 'ECF/TAX', uri: `http://siscandesv10.sispro.com.br/SpGcf2Cadastros/GcfEmpresa_List.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false, disable: this.isEcfTaxActive },
            );
          }

          if (this.hasScp) {
            this.linksList.push(
              { nome: 'SCP', uri: `http://${window.location.host}/empresas/editar/SCP/${this.Id}`, isTargetSelf: false, disable: this.isScpActive },
            );
          }
          

        }
        else {
          if (this.hasEmpresa) {
            this.linksList.push(
              { nome: 'Empresa', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/empresas/editar/${this.Id}`, isTargetSelf: true, disable: this.isEmpresaActive },
            );
          }
          
          if (this.hasContabil) {
            this.linksList.push(
              { nome: 'Contábil', uri: `https://${window.location.host}/SisproErpCloud/Contabilidade/perfilDaEmpresa?InfraEmpresaId=${this.Id}`, isTargetSelf: false, disable: this.isContabilActive },
            );
          }
         
          if (this.hasEstoque) {
            this.linksList.push(
              { nome: 'Estoque', uri: `${this.hostServerOutsystem}/SpEtq1Etq/EmpresaEstoque.aspx?InfraEmpresaId=${this.Id}&IsCorp=True`, isTargetSelf: false, disable: this.isEstoqueActive },
            );
          }
          
          if (this.hasCompras) {
            this.linksList.push(
              { nome: 'Compras', uri: `${this.hostServerOutsystem}/SpCop3Configuracoes/EmpresaCompras.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false, disable: this.isComprasActive },
            );
          }
        
          if (this.hasRecebimento) {
            this.linksList.push(
              { nome: 'Recebimento', uri: `${this.hostServerOutsystem}/SpRec1Cfg/EmpresaRecebimento.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false, disable: this.isRecebimentoActive },
            );
          }
         
          if (this.hasFiscal) {
            this.linksList.push(
              { nome: 'Fiscal', uri: `${this.hostServerOutsystem}/SpSped1Conf/SpedEmpresa_List.aspx?IsFiscal=False&StartWizard=False&InfraEmpresaId=${this.Id}&IsCorp=True`, isTargetSelf: false, disable: this.isFiscalActive },
            );
          }

          if (this.hasPatrimonio) {
            this.linksList.push(
              { nome: 'Patrimônio', uri: `${this.hostServerOutsystem}/SpPat1Conf/EmpresaPatrimonio.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false, disable: this.isPatrimonioActive },
            );
          }
         
          if (this.hasAprovacao) {
            this.linksList.push(
              { nome: 'Aprovação', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/empresas/editar/aprovacao/${this.Id}`, isTargetSelf: false, disable: this.isAprovacaoActive },
            );
          }
         
          if (this.hasFinanceiro) {
            this.linksList.push(
              { nome: 'Financeiro', uri: `${this.hostServerOutsystem}/SpFin1Cadastros/FinEmpresaParam_Edit.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false, disable: this.isFinanceiroActive },
            );
          } 
          
          if (this.hasReinf) {
            this.linksList.push(
              { nome: 'Reinf', uri: `${this.hostServerOutsystem}/SpReinf1Cad/ReinfEmpresa_List.aspx?InfraEmpresaId=${this.Id}&IsCorp=True`, isTargetSelf: false, disable: this.isReinfActive },
            );
          }
          
          if (this.hasEcfTax) {
            this.linksList.push(
              { nome: 'ECF/TAX', uri: `${this.hostServerOutsystem}/SpGcf2Cadastros/GcfEmpresa_List.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false, disable: this.isEcfTaxActive },
            );
          }
         
          if (this.hasScp) {
            this.linksList.push(
              { nome: 'SCP', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/empresas/editar/SCP/${this.Id}`, isTargetSelf: false, disable: this.isScpActive },
            );
          }

        }
      },
      error: error => {
        this._messageService.showAlertDanger(error);
        throw new Error(error);
      }
    });
  }


  public async GetProjetosLicenciado(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this._hostOutsystemsServerService.GetProjetosLicenciado()
      );

      this.ProjetosLicenciadoList = response.ProjetosLicenciado;

      for (const projeto of this.ProjetosLicenciadoList) {

        switch (projeto.Item1) {
          case 2:
            this.hasContabil = true;

            this.isContabilActive = await this.IsMenuAllowed("Contabilidade/perfilDaEmpresa");
          break;

          case 11:
            this.hasEstoque = true;

            this.isEstoqueActive = await this.IsMenuAllowed("Estoque/SpEtq1Etq/EmpresaEstoque");
          break;

          case 9:
            this.hasCompras = true;

            this.isComprasActive = await this.IsMenuAllowed("Compras/empresa-compras");
          break;

          case 8:
            this.hasRecebimento = true;

            this.isRecebimentoActive = await this.IsMenuAllowed("Recebimento/configuracao-empresa");
          break;

          case 32:
            this.hasFiscal = true;

            this.isFiscalActive = await this.IsMenuAllowed("");
          break;

          case 5:
            this.hasPatrimonio = true;

            this.isPatrimonioActive = await this.IsMenuAllowed("Patrimonio/configuracoes/perfil-empresa");
          break;

          case 19:
            this.hasAprovacao = true;

            this.isAprovacaoActive = await this.IsMenuAllowed("empresas");
          break;

          case 10:
            this.hasFinanceiro = true;

            this.isFinanceiroActive = await this.IsMenuAllowed("Financeiro/empresa-estab");
          break;

          case 6:
            this.hasReinf = true;

            this.isReinfActive = await this.IsMenuAllowed("/informacoes-do-contribuinte");
          break;

          case 24:
             this.hasEcfTax = true;

             this.isEcfTaxActive = await this.IsMenuAllowed("Corporativo/empresas");
          break;

          case 1:
            this.hasScp = true;
            this.hasEmpresa = true;

            this.isScpActive = await this.IsMenuAllowed("empresas");
            this.isEmpresaActive = this.isScpActive
            break;

          default:
         
            break;
        }

      };

    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this._messageService.showAlertDanger(msg);
      throw new Error(msg);
    }
  }

  public async IsMenuAllowed(route: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this._hostOutsystemsServerService.IsMenuAllowed(route)
      );

      return response.Boolean;

    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this._messageService.showAlertDanger(msg);
      throw new Error(msg);
    }
  }

}
