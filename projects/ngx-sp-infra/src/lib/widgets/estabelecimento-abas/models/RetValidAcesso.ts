import { IError } from "../../../../public-api";
import { ProjetosLicenciadRecord } from "../../empresa-abas/models/ProjetosLicenciadoRecord";

export class RetValidAcesso implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    ProjetosLicenciado: ProjetosLicenciadRecord[] = [];
}
