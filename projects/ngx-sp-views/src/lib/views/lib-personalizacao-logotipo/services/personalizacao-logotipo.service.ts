import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LibCustomConfigERPEnvironmentService } from '../../../custom/lib-custom-configerp-environment.service';
import { Observable, take, tap } from 'rxjs';
import { RetImage } from '../models/retImage';
import { ImagesRecord } from '../models/images.record';
import { RetError } from 'ngx-sp-infra';

@Injectable({
  providedIn: 'root'
})
export class PersonalizacaoLogotipoService {

  private readonly _BASE_URL: string = ''; // SpInfra2ConfigErpWS
  private readonly _HTTP_HEADERS: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private httpClient: HttpClient,
    private _customEnvironmentService: LibCustomConfigERPEnvironmentService
  ) { 
    this._BASE_URL = `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/PersonalizacaoLogotipo`; // SpInfra2ConfigErpWS
    this._BASE_URL = !this._customEnvironmentService.production ? this._BASE_URL : `${ this._customEnvironmentService.SpInfra2ConfigErpWS }/PersonalizacaoLogotipo`;
  }

  getLoginImg(): Observable<RetImage> {
    const headers = this._HTTP_HEADERS;
    const url = `${this._BASE_URL}/GetLoginImg`;
    
    return this.httpClient.get<RetImage>(url, { 'headers': headers })
      .pipe( take(1), tap(response => this.showErrorMessage(response)) );
  }
  
  getMenuImg(): Observable<RetImage> {
    const headers = this._HTTP_HEADERS;
    const url = `${this._BASE_URL}/GetMenuImg`;
  
    return this.httpClient.get<RetImage>(url, { 'headers': headers })
      .pipe( take(1), tap(response => this.showErrorMessage(response)) );
  }
  
  getEmailImg(): Observable<RetImage> {
    const headers = this._HTTP_HEADERS;
    const url = `${this._BASE_URL}/GetEmailImg`;
  
    return this.httpClient.get<RetImage>(url, { 'headers': headers })
      .pipe( take(1), tap(response => this.showErrorMessage(response)) );
  }
  
  enviarImgs(record: ImagesRecord): Observable<RetError> {
    const headers = this._HTTP_HEADERS;
    const url = `${ this._BASE_URL }/EnviarImgs`;
  
    return this.httpClient.post<RetError>(url, JSON.stringify(record), { 'headers': headers })
      .pipe( take(1), tap(response => this.showErrorMessage(response)) );
  }
  
  removeLoginImg(): Observable<RetError> {
    const headers = this._HTTP_HEADERS;
    const url = `${ this._BASE_URL }/RemoveLoginImg`;
  
    return this.httpClient.post<RetError>(url, null, { 'headers': headers })
      .pipe( take(1), tap(response => this.showErrorMessage(response)) );
  }
  
  removeMenuImg(): Observable<RetError> {
    const headers = this._HTTP_HEADERS;
    const url = `${ this._BASE_URL }/RemoveMenuImg`;
  
    return this.httpClient.post<RetError>(url, null, { 'headers': headers })
      .pipe( take(1), tap(response => this.showErrorMessage(response)) );
  }
  
  removeEmailImg(): Observable<RetError> {
    const headers = this._HTTP_HEADERS;
    const url = `${ this._BASE_URL }/RemoveEmailImg`;
  
    return this.httpClient.post<RetError>(url, null, { 'headers': headers })
      .pipe( take(1), tap(response => this.showErrorMessage(response)) );
  }
  
  private showErrorMessage(response: RetError): void { if (response.Error) throw Error(response.ErrorMessage); }
}
