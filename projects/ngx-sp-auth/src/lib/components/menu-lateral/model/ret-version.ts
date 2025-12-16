import { IError } from 'ngx-sp-infra';

export class RetVersion implements IError {
  public Error: boolean = false;
  public ErrorMessage: string = "";
  public Version: string = "";
}
