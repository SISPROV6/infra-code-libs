import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { RetString } from '../../models/basic-ret-types/ret-string';


@Injectable({
    providedIn: 'root'
})
export class HostOutsystemsServerService {

    //private readonly _BASE_URL: string = `http://${window.location.hostname}/SisproErpCloud/Service_Private/Infra/SpInfra2ErpWS/api/Menu`;
    private readonly _BASE_URL: string = `https://siscandesinfra.sispro.com.br/SisproErpCloud/Service_Private/Infra/SpInfra2ErpWS/api/Menu`;

    constructor(private httpClient: HttpClient) {
    }

    GetHostServerOutSystems(tenantId: number): Observable<RetString> {

        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('tenantId', tenantId);

        const url = `${this._BASE_URL}/GetHostServerOutSystems`

        return this.httpClient
            .get<RetString>(url, { 'params': params, 'headers': headers })
            .pipe(
                take(1),
                tap(response => {

                    if (response.Error) {
                        throw Error(response.ErrorMessage);
                    }

                })
            );
    }
}