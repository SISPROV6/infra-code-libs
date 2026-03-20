import { IError } from "../../../../public-api";
import { InfraErpModuloRecord } from "./InfraErpModuloRecord";

export class RetGetProdutosByLicensing implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    GetProdutosByLicensing: InfraErpModuloRecord[] = [];
}