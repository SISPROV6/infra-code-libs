import { IError } from "../../utils/ierror";
import { InfraSegConfig } from "../7Db/InfraSegConfig.record";

export class RetInfraSegConfig implements IError {
  public Error: boolean = false;
  public ErrorMessage: string = "";
  public InfraSegConfig: InfraSegConfig = new InfraSegConfig();
}