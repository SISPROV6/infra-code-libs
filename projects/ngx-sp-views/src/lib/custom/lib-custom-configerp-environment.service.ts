import { Inject, Injectable } from "@angular/core";

import { ICustomConfigERPEnvironmentService } from "./models/icustom-configerp-environment-service";
import { LIB_CUSTOM_CONFIGERP_ENVIRONMENT_SERVICE } from "./token";

@Injectable(
    { providedIn: 'root' }
)

/**Service responsável por pegar as opções do menu do projeto em que está sendo utilizada*/
export class LibCustomConfigERPEnvironmentService {

    constructor( 
        @Inject(LIB_CUSTOM_CONFIGERP_ENVIRONMENT_SERVICE) private _customEnvironmentService: ICustomConfigERPEnvironmentService
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

    public get Sp2LocalhostWS(): string  {
        return this._customEnvironmentService.Sp2LocalhostWS;
    };

	public get SpInfra2ConfigErpWS(): string {
        return this._customEnvironmentService.SpInfra2ConfigErpWS;
    };

	public get SpInfra2QueueWS(): string {
        return this._customEnvironmentService.SpInfra2QueueWS;
    };

    public get SpCrp2InfraWS(): string {
        return this._customEnvironmentService.SpCrp2InfraWS;
    }
}

