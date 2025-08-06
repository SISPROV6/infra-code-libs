import { Injectable } from "@angular/core";
import { IEnvironments } from "./models/ienvironments";

@Injectable(
    { providedIn: 'root' }
)
/**Service responsável por pegar as opções do menu do projeto em que está sendo utilizada*/
export class EnvironmentService {

    // URLs que necessitam de autenticação da infra.
    public needsAuthInfra!: Map<string, string[]>;

    // URLs que necessitam de autenticação do usuário para funcionar.
    public needsAuthAplic!: Map<string, string[]>;

    public production: boolean = false;
    public hostName: string = '';
    public product: string = '';
	
	public Sp2LocalhostInfra2AuthWS : string = '';
	public Sp2LocalhostInfra2LoginWS: string = '';
    public Sp2Localhost: string = '';

	public SpInfra2AuthWS: string = '';
	public SpInfra2LoginWS: string = '';
    public SpInfra2ErpWS: string = '';

    public ConfigurarEnvironments(properties: IEnvironments): void {

        //passando propriedades do produto para a lib
        this.production = properties.production;
        this.hostName = properties.hostName;
        this.product = properties.product;

        this.Sp2LocalhostInfra2AuthWS = properties.Sp2LocalhostInfra2AuthWS;
        this.Sp2LocalhostInfra2LoginWS = properties.Sp2LocalhostInfra2LoginWS;
        this.Sp2Localhost = properties.Sp2LocalhostWS;

        this.SpInfra2AuthWS = properties.SpInfra2AuthWS;
        this.SpInfra2LoginWS = properties.SpInfra2LoginWS;
        this.SpInfra2ErpWS = properties.SpInfra2ErpWS;
        
        this.needsAuthAplic = properties.needsAuthAplic;
        this.needsAuthInfra = properties.needsAuthInfra;
    }

}

