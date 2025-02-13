import { IError } from '../../../models/utils/ierror';
import { TreeItem } from './tree-item';

export class RetTree implements IError {
      Error: boolean = false;
      ErrorMessage: string = "";
      RetTreeModel: TreeItem[] = [];
}
