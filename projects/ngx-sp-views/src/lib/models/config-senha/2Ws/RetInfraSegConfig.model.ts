import { IError, InfraSegConfig } from "ngx-sp-infra";

export class RetInfraSegConfig implements IError {
  public Error: boolean = false;
  public ErrorMessage: string = "";
  public InfraSegConfig: InfraSegConfig = new InfraSegConfig();
}