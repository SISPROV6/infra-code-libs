import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

@Component({
  selector: 'lib-auditoria-button',
  standalone: true,
  imports: [LibIconsComponent,
    RouterModule,
    TooltipModule,],
  templateUrl: './auditoria-button.component.html',
  styleUrl: './auditoria-button.component.scss'
})
export class AuditoriaButtonComponent implements OnInit {

  protected auditoriaRoute?: string;

  @Input() public auditoria: { Entidade: string, RegistroId?: string | number, IsContratos?: boolean } | null = null;


  ngOnInit(): void {
    this.initializeAuditoriaRoute();
  }

  protected initializeAuditoriaRoute(): void {
    // const match = this._router.url.match(/^[^/]+\/[^/]+\/([^/]+)\/[^/]+/);
    // const currentProduct = match ? match[1] : null;
    const currentHostName = window.location.hostname;

    const localHostnames: string[] = [
      "localhost",
      "127.0.0.1"
    ];

    if (localHostnames.includes(currentHostName)) {
      this.auditoriaRoute = 'https://siscandesv6.sispro.com.br/SisproErpCloud/Corporativo/auditoria';

      if (this.auditoria) {
        this.auditoriaRoute = `${this.auditoriaRoute}?Entidade=${this.auditoria.Entidade}${this.auditoria.RegistroId ? "&RegistroId=" + this.auditoria.RegistroId : ""}${this.auditoria.IsContratos ? "&IsContratos=" + this.auditoria.IsContratos : ""}`;
      }
    }
    else {
      this.auditoriaRoute = `https://${currentHostName}/SisproErpCloud/Corporativo/auditoria`;

      if (this.auditoria) {
        this.auditoriaRoute = `${this.auditoriaRoute}?Entidade=${this.auditoria.Entidade}${this.auditoria.RegistroId ? "&RegistroId=" + this.auditoria.RegistroId : ""}${this.auditoria.IsContratos ? "&IsContratos=" + this.auditoria.IsContratos : ""}`;
      }
    }

  }

}
