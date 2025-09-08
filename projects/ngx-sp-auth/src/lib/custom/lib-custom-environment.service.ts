import { Inject, Injectable } from "@angular/core";

import { ICustomEnvironmentService } from "./models/icustom-environment-service";
import { LIB_CUSTOM_ENVIRONMENT_SERVICE } from "./token";

@Injectable(
    { providedIn: 'root' }
)

/**Service responsável por pegar as opções do menu do projeto em que está sendo utilizada*/
export class LibCustomEnvironmentService {

    constructor( 
        @Inject(LIB_CUSTOM_ENVIRONMENT_SERVICE) private _customEnvironmentService: ICustomEnvironmentService
    ) { }

    // URLs que necessitam de autenticação da infra.
    public get needsAuthInfra(): Map<string, string[]> {
        return this._customEnvironmentService.needsAuthInfra
    };

    // URLs que necessitam de autenticação do usuário para funcionar.
    public get needsAuthAplic(): Map<string, string[]> {
        return this._customEnvironmentService.needsAuthAplic;
    };

    public get production(): boolean {
        return this._customEnvironmentService.production;
    };

    public get hostName(): string {
        return this._customEnvironmentService.hostName;
    };

    public get product(): string  {
        return this._customEnvironmentService.product;
    };
	
	public get Sp2LocalhostInfra2AuthWS(): string  {
        return this._customEnvironmentService.Sp2LocalhostInfra2AuthWS
    };

	public get Sp2LocalhostInfra2LoginWS(): string  {
        return this._customEnvironmentService.Sp2LocalhostInfra2LoginWS
    };

    public get Sp2LocalhostWS(): string  {
        return this._customEnvironmentService.Sp2LocalhostWS;
    };

	public get SpInfra2AuthWS(): string  {
        return this._customEnvironmentService.SpInfra2AuthWS;
    };

	public get SpInfra2LoginWS(): string  {
        return this._customEnvironmentService.SpInfra2LoginWS;
    };

    public get SpInfra2ErpWS(): string  {
        return this._customEnvironmentService.SpInfra2ErpWS;
    };
}

