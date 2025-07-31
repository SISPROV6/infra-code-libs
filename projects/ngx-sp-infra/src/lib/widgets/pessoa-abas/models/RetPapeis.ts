import { IError } from "../../../../public-api";
import { CrpInPapelRecord } from "./CrpInPapelRecord";

export class RetPapeis implements IError{
    Error: boolean = false;
    ErrorMessage: string = "";
    PapeisSelected: CrpInPapelRecord[] = [];
}