import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PessoaService } from './service/pessoa.service';
import { PessoasUriRecord } from './models/PessoasUriRecord';
import { NgFor } from '@angular/common';
import { CrpInPapelRecord } from './models/CrpInPapelRecord';
import { HostOutsystemsServerService } from '../empresa-abas/host-outsystems-server.service';
import { MessageService } from '../../message/message.service';

@Component({
  selector: 'lib-pessoa-abas',
  imports: [NgFor, RouterModule],
  templateUrl: './pessoa-abas.component.html',
  styleUrl: './pessoa-abas.component.scss'
})
export class PessoaAbasComponent {

  public hostServerOutsystem = ""
  public UrisList: PessoasUriRecord[] = [];
  @Input() Id!: string | number;
  @Input() recarregar?: boolean = false;
  @Input() hostServerOutsystemValue: string = "";
  @Output() recarregarChange = new EventEmitter<boolean>();
  @Output() PessoaId = new EventEmitter<string | number>();

  public crpPesPapeisData: CrpInPapelRecord[] = [];
  public hasPapel: boolean = false;

  public activeItem: string = '';
  public isFornecedor: boolean = false;
  public tipoPessoa: number = 0;

  constructor(
    private router: Router,
    private _pessoasService: PessoaService,
    private cdr: ChangeDetectorRef,
    private _hostOutsystemsServerService: HostOutsystemsServerService,
    private _messageService: MessageService
  ) { }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.recarregar) {

      await this.GetPapeisSelected();
      await this.GetTipoPessoa();

      this.GetHostServerOutSystems();
      //this.VerifyList();

      this.cdr.detectChanges();

      setTimeout(() => {
        this.recarregarChange.emit(false);
      }, 500);

    }

    if (changes['Id'] && changes['Id'].currentValue) {
      this.PessoaId.emit(this.Id);
    }
  }



  async ngOnInit() {

    if (!this.Id) {
      throw new Error('O parâmetro "Id" é obrigatório.');
    }

    await this.GetPapeisSelected();
    await this.GetTipoPessoa();

    this.activeItem = this.router.url;

    this.GetHostServerOutSystems();
    //this.VerifyList();

  }

  public async GetPapeisSelected(): Promise<void> {
    this.hasPapel = false;
    try {
      const response = await firstValueFrom(this._pessoasService.GetPapeisSelected(this.Id));

      this.crpPesPapeisData = response.PapeisSelected;

      this.hasPapel = this.crpPesPapeisData.some(
        papel => papel.Id === "CTRCOM" || papel.Id === "REQ"
      );

      this.isFornecedor = this.crpPesPapeisData.some(
        papel => papel.Id === "FOR"
      );

    } catch (error) {

    }
  }


  public async GetTipoPessoa(): Promise<void> {

    try {
      const response = await firstValueFrom(this._pessoasService.GetTipoPessoa(this.Id));

      this.tipoPessoa = response.TipoPessoa;

    } catch (error) {

    }
  }


  public VerifyList() {

    this.UrisList = [];

    if (window.location.host.includes("localhost")) {
      this.UrisList.push(
        { nome: 'Dados básicos', uri: `http://${window.location.host}/pessoas/editar/${this.Id}`, isTargetSelf: true },
        { nome: 'Dados comerciais', uri: `http://${window.location.host}/pessoas-comercial/${this.Id}`, isTargetSelf: false },
        { nome: 'Dados financeiros', uri: `http://${window.location.host}/clientes-fornecedores/${this.Id}`, isTargetSelf: false },
        { nome: 'Compras - Dados da pessoa para suprimentos', uri: `http://${window.location.host}/pessoas-dados-suprimentos/editar/${this.Id}`, isTargetSelf: false },
        { nome: 'Compras - Dados do fornecedor', uri: `http://${window.location.host}/pessoas-dados-fornecedor/editar/${this.Id}`, isTargetSelf: false },
        { nome: 'Dados auxiliares', uri: `http://${window.location.host}/pessoas/dadosAuxiliares/${this.Id}`, isTargetSelf: false },
        { nome: 'Tipo', uri: `http://siscandesv10.sispro.com.br/SpMnt3Manutencao/TipoPessoa.aspx?IsCorp=True&CrpPessoaId=${this.Id}`, isTargetSelf: false },
        { nome: 'Fiscal', uri: `http://${window.location.host}/pessoas/pessoaFiscal/${this.Id}`, isTargetSelf: false },
        { nome: 'Contabilidade', uri: `http://${window.location.host}/Participantes?CrpPessoaId=${this.Id}`, isTargetSelf: false },
      );
    } else {
      this.UrisList.push(
        { nome: 'Dados básicos', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/pessoas/editar/${this.Id}`, isTargetSelf: true },
        // {nome: 'Dados comerciais', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Vendas/pessoas-comercial/${this.Id}`, isTargetSelf: false},
        { nome: 'Dados comerciais', uri: `${this.hostServerOutsystem}/SpNeg3Cfg/PessoaDadosComerciais.aspx?IsCorp=True&CrpPessoaId=${this.Id}`, isTargetSelf: false },
        // {nome: 'Dados financeiros', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Financeiro/clientes-fornecedores/${this.Id}`, isTargetSelf: false},
        { nome: 'Dados financeiros', uri: `${this.hostServerOutsystem}/SpFin1Cadastros/PessoaDadosFinanceiros.aspx?CrpPessoaId=${this.Id}&IsCorp=True`, isTargetSelf: false },
        { nome: 'Compras - Dados da pessoa para suprimentos', uri: `${this.hostServerOutsystem}/SisproErpCloud/Compras/pessoas-dados-suprimentos/editar/${this.Id}`, isTargetSelf: false },
        // {nome: 'Compras - Dados do fornecedor', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Compras/pessoas-dados-fornecedor/editar/${this.Id}`, isTargetSelf: false},
        { nome: 'Compras - Dados do fornecedor', uri: `${this.hostServerOutsystem}/SpCop3Configuracoes/PessoaDadosCompras.aspx?CrpPessoaId=${this.Id}&IsCorp=True`, isTargetSelf: false },
        // {nome: 'Dados auxiliares', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/pessoas/dadosAuxiliares/${this.Id}`, isTargetSelf: false},
        { nome: 'Dados auxiliares', uri: `${this.hostServerOutsystem}/SpCrp1Pessoa/PessoaDadosAuxiliares.aspx?IsCorp=True&CrpPessoaId=${this.Id}`, isTargetSelf: false },
        { nome: 'Tipo', uri: `${this.hostServerOutsystem}/SpMnt3Manutencao/TipoPessoa.aspx?IsCorp=True&CrpPessoaId=${this.Id}`, isTargetSelf: false },
        // {nome: 'Fiscal', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/pessoas/pessoaFiscal/${this.Id}`, isTargetSelf: false},
        { nome: 'Fiscal', uri: `${this.hostServerOutsystem}/SpCrp1Pessoa/PessoaFiscal.aspx?CrpPessoaId=${this.Id}&IsCorp=True`, isTargetSelf: false },
        { nome: 'Contabilidade', uri: `https://${window.location.host}/SisproErpCloud/Contabilidade/Participantes?CrpPessoaId=${this.Id}`, isTargetSelf: false },
      );
    }


    if (this.hasPapel && this.tipoPessoa === 2 && this.isFornecedor) {

    }

    else if (this.hasPapel && this.tipoPessoa === 2) {
      this.UrisList = this.UrisList.filter(item => item.nome !== 'Compras - Dados do fornecedor');

    }

    else if (this.isFornecedor) {
      this.UrisList = this.UrisList.filter(item => item.nome !== 'Compras - Dados da pessoa para suprimentos');
    }

    else {
      this.UrisList = this.UrisList.filter(item => item.nome !== 'Compras - Dados dos fornecedor');
      this.UrisList = this.UrisList.filter(item => item.nome !== 'Compras - Dados da pessoa para suprimentos');
    }
  }


  public GetHostServerOutSystems(): void {
    this._hostOutsystemsServerService.GetHostServerOutSystems(0).subscribe({
      next: (response) => {
        this.hostServerOutsystem = response.String;
        this.VerifyList();
      },
      error: error => {
        this._messageService.showAlertDanger(error);
        throw new Error(error);
      }
    });
  }

}
