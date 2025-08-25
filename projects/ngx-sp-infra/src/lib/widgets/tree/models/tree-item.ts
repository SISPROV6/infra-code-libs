export class TreeItem {
  id: number = 0;
  label: string = "";
  children?: TreeItem[];
  expanded: boolean = false;
  has_children: boolean = false;
  is_selected: boolean = false;
  key: string = "";
  aplicClass: boolean = false;
  icon?: string;
  level: number = 0;
}