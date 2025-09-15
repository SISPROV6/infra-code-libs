import { IError } from 'ngx-sp-infra';

import { IProjeto } from './iprojeto';

export class RetDropDown implements IError {
  public Error: boolean = false;
  public ErrorMessage: string = "";

  public Dropdown!: IProjeto[];
}
