import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { links } from './models/links-record';
import { Router } from '@angular/router';
import { HostOutsystemsServerService } from './host-outsystems-server.service';
import { MessageService } from '../../message/message.service';

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
  @Input() hostServerOutsystemValue: string = "";
  @Output() EmpresaId = new EventEmitter<string | number>();

  public activeItem: string = '';

  constructor(
    private router: Router,
    private _hostOutsystemsServerService: HostOutsystemsServerService,
    private _messageService: MessageService
  ) { }

  ngOnInit(): void {
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

          this.linksList.push(
            { nome: 'Empresa', uri: `http://${window.location.host}/empresas/editar/${this.Id}`, isTargetSelf: true },
            { nome: 'Contábil', uri: `http://${window.location.host}/perfilDaEmpresa?InfraEmpresaId=${this.Id}`, isTargetSelf: false },
            { nome: 'Estoque', uri: `http://${window.location.host}/SpEtq1Etq/EmpresaEstoque/editar/${this.Id}`, isTargetSelf: false },
            { nome: 'Compras', uri: `http://${window.location.host}/empresa-compras/editar/${this.Id}`, isTargetSelf: false },
            { nome: 'Recebimento', uri: `http://${window.location.host}/configuracao-empresa/editar/${this.Id}`, isTargetSelf: false },
            { nome: 'Fiscal', uri: `http://${window.location.host}/perfil-da-empresa/editar/${this.Id}`, isTargetSelf: false },
            { nome: 'Patrimônio', uri: `http://siscandesv10.sispro.com.br/SpPat1Conf/EmpresaPatrimonio.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false },
            { nome: 'Aprovação', uri: `http://${window.location.host}/empresas/editar/aprovacao/${this.Id}`, isTargetSelf: false },
            { nome: 'Financeiro', uri: `http://${window.location.host}/empresa-estab/editar/empresa/${this.Id}`, isTargetSelf: false },
            { nome: 'Reinf', uri: `http://siscandesv10.sispro.com.br/SpReinf1Cad/ReinfEmpresa_List.aspx?InfraEmpresaId=${this.Id}&IsCorp=True`, isTargetSelf: false },
            { nome: 'ECF/TAX', uri: `http://siscandesv10.sispro.com.br/SpGcf2Cadastros/GcfEmpresa_List.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false },
            { nome: 'SCP', uri: `http://${window.location.host}/empresas/editar/SCP/${this.Id}`, isTargetSelf: false },
          );

        }
        else {

          this.linksList.push(
            { nome: 'Empresa', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/empresas/editar/${this.Id}`, isTargetSelf: true },
            { nome: 'Contábil', uri: `https://${window.location.host}/SisproErpCloud/Contabilidade/perfilDaEmpresa?InfraEmpresaId=${this.Id}`, isTargetSelf: false },
            { nome: 'Estoque', uri: `${this.hostServerOutsystem}/SpEtq1Etq/EmpresaEstoque.aspx?InfraEmpresaId=${this.Id}&IsCorp=True`, isTargetSelf: false },
            { nome: 'Compras', uri: `${this.hostServerOutsystem}/SpCop3Configuracoes/EmpresaCompras.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false },
            { nome: 'Recebimento', uri: `${this.hostServerOutsystem}/SpRec1Cfg/EmpresaRecebimento.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false },
            { nome: 'Fiscal', uri: `${this.hostServerOutsystem}/SpSped1Conf/SpedEmpresa_List.aspx?IsFiscal=False&StartWizard=False&InfraEmpresaId=${this.Id}&IsCorp=True`, isTargetSelf: false },
            { nome: 'Patrimônio', uri: `${this.hostServerOutsystem}/SpPat1Conf/EmpresaPatrimonio.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false },
            { nome: 'Aprovação', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/empresas/editar/aprovacao/${this.Id}`, isTargetSelf: false },
            { nome: 'Financeiro', uri: `${this.hostServerOutsystem}/SpFin1Cadastros/FinEmpresaParam_Edit.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false },
            { nome: 'Reinf', uri: `${this.hostServerOutsystem}/SpReinf1Cad/ReinfEmpresa_List.aspx?InfraEmpresaId=${this.Id}&IsCorp=True`, isTargetSelf: false },
            { nome: 'ECF/TAX', uri: `${this.hostServerOutsystem}/SpGcf2Cadastros/GcfEmpresa_List.aspx?IsCorp=True&InfraEmpresaId=${this.Id}`, isTargetSelf: false },
            { nome: 'SCP', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/empresas/editar/SCP/${this.Id}`, isTargetSelf: false },
          );

        }
      },
      error: error => {
        this._messageService.showAlertDanger(error);
        throw new Error(error);
      }
    });
  }


}
