import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CheckUrlAndMethodService, MessageService, Utils } from 'ngx-sp-infra';
import { LibCustomEnvironmentService } from '../custom/lib-custom-environment.service';
import { AuthStorageService } from '../storage/auth-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectUtilservice {

  constructor(
    private router: Router,
    private authStorageService: AuthStorageService,
    private checkUrlAndMethodService: CheckUrlAndMethodService,
    private messageService: MessageService,
    private _customEnvironmentService: LibCustomEnvironmentService
  ) { }

  // Exibe a mensagem de erro de uma requisição http
  public showHttpError(error: any) {

    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do cliente
      this.messageService.showAlertDanger(Utils.getHttpErrorMessage(error));
    } else {
      // Erro ocorreu no lado do servidor
      let isUnauthorizedAccess = error.status === 401;

      if (isUnauthorizedAccess) {
        let isFromAplic = this.checkUrlAndMethodService.needsAuthRequest(error.url, "*", this._customEnvironmentService.needsAuthAplic);

        if (isFromAplic) {
          // Remove a autenticação do usuário.
          this.authStorageService.isLoggedInSub.next(false);
          this.authStorageService.urlRedirect = "/";

          let promise = this.router.navigate(["/auth/login"]);

          promise.then(this.showExpiredAccess.bind(this));
        } else {
          this.messageService.showAlertDanger(Utils.getHttpErrorMessage(error));
        }

      } else {
        this.messageService.showAlertDanger(Utils.getHttpErrorMessage(error));
      }

    }

  }

  // Exibe a mensagem de erro de uma requisição HTTP em caso de lógica integrada OS
  public showHTTPErrorOS(error: any) {

    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do cliente
      this.router.navigate(["/auth/login"]).then(e => {
        this.messageService.showAlertDanger(Utils.getHttpErrorMessage(error));
      });
    } else {
      // Erro ocorreu no lado do servidor
      let isUnauthorizedAccess = error.status === 401;

      if (isUnauthorizedAccess) {
        let isFromAplic = this.checkUrlAndMethodService.needsAuthRequest(error.url, "*", this._customEnvironmentService.needsAuthAplic);

        if (isFromAplic) {
          // Remove a autenticação do usuário.
          this.authStorageService.isLoggedInSub.next(false);
          this.authStorageService.urlRedirect = "/";

          this.router.navigate(["/auth/login"]).then(e => {
            this.messageService.showAlertDanger(Utils.getHttpErrorMessage(error));
          });
        } else {
          this.router.navigate(["/auth/login"]).then(e => {
            this.messageService.showAlertDanger(Utils.getHttpErrorMessage(error));
          });
        }

      } else {
        this.router.navigate(["/auth/login"]).then(e => {
            this.messageService.showAlertDanger(Utils.getHttpErrorMessage(error));
          });
      }

    }

  }

  // Mostra uma mensagem de sessão expirada.
  private showExpiredAccess(navigationResult: boolean) {

    if (navigationResult) {
      this.messageService.showAlertWarning("Sessão expirada, logue-se novamente.");
    }

  }

  // Obtém o hostName
	public getHostName(): string {
		return this._customEnvironmentService.hostName
	}

}
