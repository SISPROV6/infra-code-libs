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
    public hostName: string = "https://siscandesinfra.sispro.com.br";
    public product = '';

    public ConfigurarEnvironments(propriedades: IEnvironments): void {

        //passando propriedades do produto para a lib
        this.needsAuthAplic = propriedades.needsAuthAplic;
        this.needsAuthInfra = propriedades.needsAuthInfra;
    }

}

