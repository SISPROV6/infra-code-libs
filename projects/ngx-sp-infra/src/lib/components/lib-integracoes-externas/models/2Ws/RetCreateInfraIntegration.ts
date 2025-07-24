import { IError } from "../../../../models/utils/ierror";

export class RetCreateInfraIntegration implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    Integration: number = 0;
}