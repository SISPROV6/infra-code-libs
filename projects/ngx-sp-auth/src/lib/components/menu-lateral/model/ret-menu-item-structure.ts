import { IError } from 'ngx-sp-infra';
import { IMenuItemStructure } from './imenu-item-structure.model';

export class RetMenuItemStructure implements IError {
  public Error: boolean = false;
  public ErrorMessage: string = "";

  public MenuItem: IMenuItemStructure[] = [];
}
