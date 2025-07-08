import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../message/message.service';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class TenantService {

  private readonly __local_key = 'user_auth_configerp_v6';


  constructor(
    private _messageService:MessageService,
    private _router: Router
  ) {

    const expectedLocalAuthStorage = localStorage.getItem(this.__local_key);

    if (expectedLocalAuthStorage) {
      const localAuthStorage = JSON.parse(expectedLocalAuthStorage) as TenantService;
      this.__tenantId = localAuthStorage.__tenantId;
      this.__dominio = localAuthStorage.__dominio;

    }

  }

  // #region GETTERS/SETTERS

  public isLoggedInSub = new BehaviorSubject<boolean>(false);

  //tenantId
  private __tenantId: number = 0;

  public get tenantId(): number {
    return this.__tenantId;
  }

  public set tenantId(value: number) {
    this.__tenantId = value;
  }


  /** Domínio */
  private __dominio: string = "";

  public get dominio(): string {
    return this.__dominio;
  }

  public set dominio(value: string) {
    this.__dominio = value;
  }

  // #region ==========> UTILS <==========
  public validateTenant(tenantId?: number): void {
    if (!tenantId || tenantId === 0) {
      this._messageService.showAlertInfo("Você deve selecionar um domínio para executar esta opção.")

      this._router.navigate(["/home"]);
      throw new Error("Você deve selecionar um domínio para executar esta opção.");
    }
  }
  // #endregion ==========> UTILS <==========

}
