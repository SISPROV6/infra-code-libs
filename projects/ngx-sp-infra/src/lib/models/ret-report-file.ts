import { IError } from "./ierror";
import { ReportFile } from "./report-file";

export class RetReportFile implements IError {
    Error: boolean = false;
    ErrorMessage: string = "";
    ReportFile: ReportFile = new ReportFile();
}
