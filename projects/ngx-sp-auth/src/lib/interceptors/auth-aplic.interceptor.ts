import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable, from, lastValueFrom } from 'rxjs';

import { AuthStorageService } from '../storage/auth-storage.service';
import { CheckUrlAndMethodService } from 'ngx-sp-infra';
import { LibCustomEnvironmentService } from '../custom/lib-custom-environment.service';
/**
 * \brief Intercepta uma chamada HTTP para inserir o usuário logado no header em conjunto
 *        com o login para uso da API.
 *
 * Depende do serviço de autenticação.
 */
@Injectable(
  { providedIn: 'root' }
)
export class AuthAplicInterceptor implements HttpInterceptor {

  constructor(
    private authCheckService: CheckUrlAndMethodService,
    private token: AuthStorageService,
        private _customEnvironmentService: LibCustomEnvironmentService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // convert promise to observable using 'from' operator
    return from(this.handle(req, next))
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    let changedReq: HttpRequest<any> = req;

    
    if (this.authCheckService.needsAuthRequest(req.url, req.method, this._customEnvironmentService.needsAuthAplic)) {
      // Verifica se o Token precisa ser renovado
      await this.token.renewToken();

      // Adiciona as autenticações necessárias ao servidor.
      let headers: HttpHeaders = req.headers.set(
        'Authorization',
        `Bearer ${this.token.authToken}`
      );

      changedReq = req.clone({ headers: headers });
    }

    return await lastValueFrom(next.handle(changedReq));
  }

  /* >>> Comentado por Molina - 19/10/2023 - Lógica anterior
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let changedReq: HttpRequest<any> = req;

    if (this.authCheckService.needsAuthRequest(req.url, req.method, environment.needsAuthAplic)) {

      // Adiciona as autenticações necessárias ao servidor.
      let headers: HttpHeaders = req.headers.set(
        'Authorization',
        `Bearer ${ this.token.authToken }`
      );

      changedReq = req.clone({ headers: headers });
    }

    return next.handle(changedReq);
  }
  */

}
