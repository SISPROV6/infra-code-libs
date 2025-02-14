import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  // [...]
  // #endregion PRIVATE

  // #region PUBLIC
  // [...]
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor(
    private router: Router,
    private _messageService: MessageService
  ) { }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> UTILS <==========
  public validateTenant(tenantId?: number): void {
    if (!tenantId || tenantId === 0) {
      this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")
      console.error("Você deve selecionar um domínio para executar esta opção.");

      throw new Error("Você deve selecionar um domínio para executar esta opção.");
      // this.router.navigate(["/home"]);
    }
  }
  // #endregion ==========> UTILS <==========

}
