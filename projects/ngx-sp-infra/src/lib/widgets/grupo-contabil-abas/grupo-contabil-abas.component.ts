import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { links } from './models/links-record';
import { HostOutsystemsServerService } from '../empresa-abas/host-outsystems-server.service';
import { firstValueFrom } from 'rxjs';
import { ProjetosLicenciadRecord } from '../empresa-abas/models/ProjetosLicenciadoRecord';
import { MessageService } from '../../message/message.service';

@Component({
  selector: 'lib-grupo-contabil-abas',
  imports: [NgFor],
  templateUrl: './grupo-contabil-abas.component.html',
  styleUrl: './grupo-contabil-abas.component.scss'
})
export class GrupoContabilAbasComponent {

  public linksList: links[] = [];
  @Input() Id: string | number = "";
  @Input() hostServerOutsystemValue: string = "";
  @Output() GrupoContabilId = new EventEmitter<string | number>();

  public activeItem: string = '';

  public hasContabil: boolean = false;
  public hasCompras: boolean = false;

  public ProjetosLicenciadoList: ProjetosLicenciadRecord[] = [];

  constructor(
    private router: Router,
    private _hostOutsystemsServerService: HostOutsystemsServerService,
    private _messageService: MessageService,) { }

  async ngOnInit() {

    await this.GetProjetosLicenciado();

    if (window.location.host.includes("localhost")) {

      if (this.hasContabil) {
        this.linksList.push(
          { nome: 'Grupo contábil', uri: `http://${window.location.host}/grupo-contabil-corp/editar/${this.Id}`, isTargetSelf: true },
        );
      }

      if (this.hasCompras) {
        this.linksList.push(
          { nome: 'Dados compras', uri: `https://siscandesv6.sispro.com.br/SisproErpCloud/Compras/grupo-contabil/editar/${this.Id}`, isTargetSelf: false }
        );
      }


    } else {

      if (this.hasContabil) {
        this.linksList.push(
          { nome: 'Grupo contábil', uri: `https://${window.location.host}/SisproErpCloud/Corporativo/grupo-contabil-corp/editar/${this.Id}`, isTargetSelf: true },
        );
      }

      if (this.hasCompras) {
        this.linksList.push(
          // { nome: 'Dados compras', uri: `${this.hostServerOutsystemValue}/SisproErpCloud/Compras/grupo-contabil/editar/${this.Id}`, isTargetSelf: false },
          { nome: 'Dados compras', uri: `${this.hostServerOutsystemValue}/SpCop3Configuracoes/CopConfigGrCont_Edit.aspx?&CrpGrupoContabilId=${this.Id}&IsCorp=True`, isTargetSelf: false },
        );
      }

    }

    this.activeItem = this.router.url;

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['Id'] && changes['Id'].currentValue) {
      this.GrupoContabilId.emit(this.Id);
    }
  }

  public async GetProjetosLicenciado(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this._hostOutsystemsServerService.GetProjetosLicenciado()
      );

      this.ProjetosLicenciadoList = response.ProjetosLicenciado;

      this.ProjetosLicenciadoList.forEach(projeto => {

        switch (projeto.Item1) {


          case 9:
            this.hasCompras = true;
            break;

          case 2:
            this.hasContabil = true;
            break;

          default:
            break;
        }

      });

    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this._messageService.showAlertDanger(msg);
      throw new Error(msg);
    }
  }

}
