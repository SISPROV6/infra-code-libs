import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { CheckUrlAndMethodService } from "ngx-sp-infra";
import { LibCustomEnvironmentService } from '../custom/lib-custom-environment.service';

/**
 * \brief Intercepta uma chamada HTTP para inserir a autenticação da Sispro.
 */
@Injectable(
    { providedIn: 'root' }
)
export class AuthInfraInterceptor implements HttpInterceptor {

    constructor(
        private authCheckService: CheckUrlAndMethodService,
        private _customEnvironmentService: LibCustomEnvironmentService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let changedReq: HttpRequest<any> = req;

        if (this.authCheckService.needsAuthRequest(req.url, req.method, this._customEnvironmentService.needsAuthInfra)) {
            // Adiciona as autenticações necessárias ao servidor. Autenticação básica.
            let headers: HttpHeaders = req.headers.set(
                "Authorization",
                `Basic ${btoa(`${ localStorage.getItem('configServerUser') }:${ localStorage.getItem('configServerPassword') }`) }
                `);

            changedReq = req.clone({
                headers: headers,
                withCredentials: true   // Erick: Adicionado devido à implementação dos Cookies como autenticação
            });
        }

        return next.handle(changedReq);
    }

}