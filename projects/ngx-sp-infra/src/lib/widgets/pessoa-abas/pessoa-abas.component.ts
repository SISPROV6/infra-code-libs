import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PessoaService } from './service/pessoa.service';
import { PessoasUriRecord } from './models/PessoasUriRecord';
import { NgFor } from '@angular/common';
import { CrpInPapelRecord } from './models/CrpInPapelRecord';

@Component({
  selector: 'lib-pessoa-abas',
  imports: [NgFor],
  templateUrl: './pessoa-abas.component.html',
  styleUrl: './pessoa-abas.component.scss'
})
export class PessoaAbasComponent {

  public UrisList: PessoasUriRecord[] = [];
  @Input() Id!: string | number;
  @Input() recarregar?: boolean = false;

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
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.recarregar) {

      await this.GetPapeisSelected();
      await this.GetTipoPessoa();
      this.VerifyList();

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

    this.VerifyList();
    
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

    if(window.location.host.includes("localhost")){
      this.UrisList.push(
      {nome: 'Dados básicos', uri: `http://${window.location.host}/pessoas/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Dados comerciais', uri: `http://siscandesv10.sispro.com.br/SpNeg3Cfg/PessoaDadosComerciais.aspx?IsCorp=True&CrpPessoaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Dados financeiros', uri: `http://siscandesv10.sispro.com.br/SpFin1Cadastros/PessoaDadosFinanceiros.aspx?CrpPessoaId=${this.Id}&IsCorp=True`, isTargetSelf: false},
      {nome: 'Compras - Dados da pessoa para suprimentos', uri: `http://${window.location.host}/pessoas-dados-suprimentos/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Compras - Dados do fornecedor', uri: `http://${window.location.host}/pessoas-dados-fornecedor/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Dados auxiliares', uri: `http://${window.location.host}/pessoas/dadosAuxiliares/${this.Id}`, isTargetSelf: false},
      {nome: 'Tipo', uri: `http://siscandesv10.sispro.com.br/SpMnt3Manutencao/TipoPessoa.aspx?IsCorp=True&CrpPessoaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Fiscal', uri: `http://${window.location.host}/pessoas/pessoaFiscal/${this.Id}`, isTargetSelf: false},
      {nome: 'Contabilidade', uri: `http://${window.location.host}/Participantes?CrpPessoaId=${this.Id}`, isTargetSelf: false},
    );
    }else{
      this.UrisList.push(
      {nome: 'Dados básicos', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/pessoas/editar/${this.Id}`, isTargetSelf: true},
      {nome: 'Dados comerciais', uri: `https://siscandesv10.sispro.com.br/SpNeg3Cfg/PessoaDadosComerciais.aspx?IsCorp=True&CrpPessoaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Dados financeiros', uri: `https://siscandesv10.sispro.com.br/SpFin1Cadastros/PessoaDadosFinanceiros.aspx?CrpPessoaId=${this.Id}&IsCorp=True`, isTargetSelf: false},
      {nome: 'Compras - Dados da pessoa para suprimentos', uri: `https://${window.location.host}/SisproErpCloud/Compras/pessoas-dados-suprimentos/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Compras - Dados do fornecedor', uri: `https://${window.location.host}/SisproErpCloud/Compras/pessoas-dados-fornecedor/editar/${this.Id}`, isTargetSelf: false},
      {nome: 'Dados auxiliares', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/pessoas/dadosAuxiliares/${this.Id}`, isTargetSelf: false},
      {nome: 'Tipo', uri: `https://siscandesv10.sispro.com.br/SpMnt3Manutencao/TipoPessoa.aspx?IsCorp=True&CrpPessoaId=${this.Id}`, isTargetSelf: false},
      {nome: 'Fiscal', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/pessoas/pessoaFiscal/${this.Id}`, isTargetSelf: false},
      {nome: 'Contabilidade', uri: `https://${window.location.host}/SisproErpCloud/Contabilidade/Participantes?CrpPessoaId=${this.Id}`, isTargetSelf: false},
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

}
