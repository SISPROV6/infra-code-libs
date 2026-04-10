import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { estabelecimentoUriRecord } from './models/estabelecimentoUriRecord';
import { HostOutsystemsServerService } from '../empresa-abas/host-outsystems-server.service';
import { MessageService } from '../../message/message.service';
import { firstValueFrom } from 'rxjs';
import { ProjetosLicenciadRecord } from '../empresa-abas/models/ProjetosLicenciadoRecord';

@Component({
  selector: 'lib-estabelecimento-abas',
  imports: [NgFor],
  templateUrl: './estabelecimento-abas.component.html',
  styleUrl: './estabelecimento-abas.component.scss'
})
export class EstabelecimentoAbasComponent {

  public hostServerOutsystem = ""
  public linksList: estabelecimentoUriRecord[] = [];
  @Input() Id: string | number = "";
  @Input() empresaId: string | null = "";
  @Input() hostServerOutsystemValue: string = "";
  @Output() EstabId = new EventEmitter<string | number>();

  public activeItem: string = '';

  public hasRecebimento: boolean = false;
  public hasFinanceiro: boolean = false;
  public hasFiscal: boolean = false;
  public hasCompras: boolean = false;
  public hasContratos: boolean = false;
  public hasVendas: boolean = false;
  public hasCno: boolean = false;
  public hasTributos: boolean = false;
  public hasEstabelecimento: boolean = false;

  public isRecebimentoActive: boolean = false;
  public isFinanceiroActive: boolean = false;
  public isFiscalActive: boolean = false;
  public isComprasActive: boolean = false;
  public isContratosActive: boolean = false;
  public isVendasActive: boolean = false;
  public isCnoActive: boolean = false;
  public isTributosActive: boolean = false;
  public isEstabelecimentoActive: boolean = false;

  public ProjetosLicenciadoList: ProjetosLicenciadRecord[] = [];

  constructor(
    private router: Router,
    private _hostOutsystemsServerService: HostOutsystemsServerService,
    private _messageService: MessageService,
  ) { }

 async ngOnInit(){

    await this.GetProjetosLicenciado();

    this.GetHostServerOutSystems();
    this.activeItem = this.router.url;

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['Id'] && changes['Id'].currentValue) {
      this.EstabId.emit(this.Id);
    }
  }

  public GetHostServerOutSystems(): void {
    this._hostOutsystemsServerService.GetHostServerOutSystems(0).subscribe({
      next: (response) => {
        this.hostServerOutsystem = response.String;

        if (window.location.host.includes("localhost")) {
          if (this.hasEstabelecimento) {
            this.linksList.push(
              { nome: 'Estabelecimento', uri: `http://${window.location.host}/estabelecimentos/editar/${this.Id}`, isTargetSelf: true, disable: this.isEstabelecimentoActive },
            )
          }

          if (this.hasRecebimento) {
            this.linksList.push(
              { nome: 'Recebimento', uri: `http://${window.location.host}/configuracao-estabelecimento/editar/${this.Id}`, isTargetSelf: false, disable: this.isRecebimentoActive },
            )
          }
          
          if (this.hasFinanceiro) {
            this.linksList.push(
              { nome: 'Financeiro', uri: `http://${window.location.host}/empresa-estab/editar/estab/0?id=${this.Id}&empresaId=${this.empresaId}`, isTargetSelf: false, disable: this.isFinanceiroActive },
            )
          }
          
          if (this.hasFiscal) {
            this.linksList.push(
              { nome: 'Fiscal', uri: `http://${window.location.host}/identificacao-da-entidade/editar/${this.Id}`, isTargetSelf: false, disable: this.isFiscalActive },
            )
          }
           
          if (this.hasCompras) {
            this.linksList.push(
              { nome: 'Compras', uri: `http://${window.location.host}/estabelecimento-compras/editar/${this.Id}`, isTargetSelf: false, disable: this.isComprasActive },
            )
          }
          
          if (this.hasContratos) {
            this.linksList.push(
              { nome: 'Contratos', uri: `http://siscandesv10.sispro.com.br/SpCtr1Param/CtrGnCfgApl_Edit.aspx?EstabelecimentoId=${this.Id}&IsCorp=True`, isTargetSelf: false, disable: this.isContratosActive },
            )
          }

          if (this.hasVendas) {
            this.linksList.push(
              { nome: 'Vendas', uri: `http://siscandesv10.sispro.com.br/SpNeg3Cfg/CfgEstabelecimento.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false, disable: this.isVendasActive },
            )
          }

          if (this.hasCno) {
            this.linksList.push(
              { nome: 'CNO', uri: `http://${window.location.host}/estabelecimentos/EstabCnoDet/${this.Id}`, isTargetSelf: false, disable: this.isCnoActive },
            )
          }

          if (this.hasTributos) {
            this.linksList.push(
              { nome: 'Tributos', uri: `http://siscandesv10.sispro.com.br/SpFis1Interface/ConfigOrdemCalcImpostos.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false, disable: this.isTributosActive },
            )
          }

            
        } else {
          if (this.hasEstabelecimento) {
            this.linksList.push(
              { nome: 'Estabelecimento', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/estabelecimentos/editar/${this.Id}`, isTargetSelf: true, disable: this.isEstabelecimentoActive },
            )
          }

          if (this.hasRecebimento) {
            this.linksList.push(
              // {nome: 'Recebimento', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Recebimento/configuracao-estabelecimento/editar/${this.Id}`, isTargetSelf: false},
              { nome: 'Recebimento', uri: `${this.hostServerOutsystem}/SpRec1Cfg/EstabRecebimento.aspx?EstabelecimentoId=${this.Id}&IsCorp=True`, isTargetSelf: false, disable: this.isRecebimentoActive },
            )
          }

          if (this.hasFinanceiro) {
            this.linksList.push(
              // {nome: 'Financeiro', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Financeiro/empresa-estab/editar/estab/0?id=${this.Id}&empresaId=${this.empresaId}`, isTargetSelf: false},
              { nome: 'Financeiro', uri: `${this.hostServerOutsystem}/SpFin1Cadastros/FinEstabParam_Edit.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false, disable: this.isFinanceiroActive },
            )
          }

          if (this.hasFiscal) {
            this.linksList.push(
              // {nome: 'Fiscal', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Efd-Reinf/identificacao-da-entidade/editar/${this.Id}`, isTargetSelf: false},
              { nome: 'Fiscal', uri: `${this.hostServerOutsystem}/SpSped1Conf/IdentificacaoDaEntidade_list.aspx?IsFiscal=False&StartWizard=False&EstabelecimentoId=${this.Id}&IsCorp=True`, isTargetSelf: false, disable: this.isFiscalActive },
            )
          }

          if (this.hasCompras) {
            this.linksList.push(
              // {nome: 'Compras', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Compras/estabelecimento-compras/editar/${this.Id}`, isTargetSelf: false},
              { nome: 'Compras', uri: `${this.hostServerOutsystem}/SpCop3Configuracoes/EstabCompras.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false, disable: this.isComprasActive },
            )
          }


          if (this.hasContratos) {
            this.linksList.push(
              { nome: 'Contratos', uri: `${this.hostServerOutsystem}/SpCtr1Param/CtrGnCfgApl_Edit.aspx?EstabelecimentoId=${this.Id}&IsCorp=True`, isTargetSelf: false, disable: this.isContratosActive },
            )
          }

          if (this.hasVendas) {
            this.linksList.push(
              { nome: 'Vendas', uri: `${this.hostServerOutsystem}/SpNeg3Cfg/CfgEstabelecimento.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false, disable: this.isComprasActive },
            )
          }

          if (this.hasCno) {
            this.linksList.push(
              { nome: 'CNO', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/estabelecimentos/EstabCnoDet/${this.Id}`, isTargetSelf: false, disable: this.isCnoActive },
            )
          }

          if (this.hasTributos) {
            this.linksList.push(
              { nome: 'Tributos', uri: `${this.hostServerOutsystem}/SpFis1Interface/ConfigOrdemCalcImpostos.aspx?IsCorp=True&EstabelecimentoId=${this.Id}`, isTargetSelf: false, disable: this.isTributosActive },
            )
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

      for (const projeto of this.ProjetosLicenciadoList){

        switch (projeto.Item1) {


          case 9:
            this.hasCompras = true;

            this.isComprasActive = await this.IsMenuAllowed("Compras/estabelecimento-compras");
          break;

          case 8:
            this.hasRecebimento = true;

            this.isRecebimentoActive = await this.IsMenuAllowed("Recebimento/configuracao-estabelecimento");
          break;

          case 32:
            this.hasFiscal = true;

            this.isFiscalActive = await this.IsMenuAllowed("/identificacao-da-entidade");
          break;

          case 10:
            this.hasFinanceiro = true;

            this.isFinanceiroActive = await this.IsMenuAllowed("Financeiro/empresa-estab");
          break;

          case 4:
            this.hasContratos = true;

            this.isContratosActive = await this.IsMenuAllowed(""); //Essa tela existe???
          break;

          case 7:
            this.hasVendas = true;

            this.isVendasActive = await this.IsMenuAllowed("Vendas/configuracoes-de-impressao");
          break;

          case 1:
            this.hasCno = true;
            this.hasEstabelecimento = true;

            this.isEstabelecimentoActive = await this.IsMenuAllowed("estabelecimentos");

            if(this.isEstabelecimentoActive){
              this.isCnoActive = true;
            }
          break;

          case 34:
            this.hasTributos = true;

            this.isTributosActive = await this.IsMenuAllowed("Vendas/ordem-calculo-imposto");
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
