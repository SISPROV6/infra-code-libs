import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";

import { Observable } from "rxjs";

import { CheckUrlAndMethodService } from "ngx-sp-infra";
import { EnvironmentService } from './../environments/environments.service';

/**
 * \brief Intercepta uma chamada HTTP para inserir a autenticação da Sispro.
 */
@Injectable(
    { providedIn: 'root' }
)
export class AuthInfraInterceptor implements HttpInterceptor {

    constructor(
        private authCheckService: CheckUrlAndMethodService,
        private _environmentService: EnvironmentService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let changedReq: HttpRequest<any> = req;

        if (this.authCheckService.needsAuthRequest(req.url, req.method, this._environmentService.needsAuthInfra)) {
            // Adiciona as autenticações necessárias ao servidor. Autenticação básica.
            let headers: HttpHeaders = req.headers.set(
                "Authorization",
                `Basic ${btoa(`${ localStorage.getItem('configServerUser') }:${ localStorage.getItem('configServerPassword') }`) }
                `);

            changedReq = req.clone({ headers: headers });
        }

        return next.handle(changedReq);
    }

}