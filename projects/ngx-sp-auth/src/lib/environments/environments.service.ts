import { Injectable } from "@angular/core";
import { IEnvironments } from "./models/ienvironments";

@Injectable(
    { providedIn: 'root' }
)
/**Service responsável por pegar as opções do menu do projeto em que está sendo utilizada*/
export class EnvironmentService {

    // URLs que necessitam de autenticação da infra.
    needsAuthInfra!: Map<string, string[]>;

    // URLs que necessitam de autenticação do usuário para funcionar.
    needsAuthAplic!: Map<string, string[]>;

    production: boolean = false;
    hostName: string = "https://siscandesv6.sispro.com.br";

    ConfigurarEnvironments(propriedades: IEnvironments): void {

        //passando propriedades do produto para a lib
        this.needsAuthAplic = propriedades.needsAuthAplic;
        this.needsAuthInfra = propriedades.needsAuthInfra;
    }

}

