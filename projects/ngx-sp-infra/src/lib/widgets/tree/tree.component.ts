import { NgFor, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LibIconsComponent } from "../lib-icons/lib-icons.component";
import { TreeItem } from "./models/tree-item";
import { SearchTreePipe } from "./pipes/search-tree.pipe";

@Component({
    selector: "app-tree, lib-tree",
    templateUrl: "./tree.component.html",
    styleUrls: ["./tree.component.scss"],
    
    imports: [NgIf, LibIconsComponent, FormsModule, NgFor, SearchTreePipe]
})
export class TreeComponent {
  constructor() {}

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _openAll: boolean = false;
  private _items: TreeItem[] | any[] = [];
  // #endregino PRIVATE

  // #region PUBLIC
  @Input()
  public get items(): TreeItem[] | any[] { return this._items; }
  public set items(value: TreeItem[] | any[]) { this._items = value; }

  /** Responsável por abrir ou fechar todas as opções sendo exibidas na lista
   * @default false */
  @Input()
  public get openAll(): boolean { return this._openAll; }
  public set openAll(value: boolean) {
    this._openAll = value;

    this.items.forEach(elem => {
      elem.expanded = value;
      elem.aplicClass = value;
    });
  }

  @Input() public checkbox: boolean = false;
  @Input() public filter: boolean = false;


  @Output() public onSelect: EventEmitter<boolean> = new EventEmitter();
  @Output() public onEvent: EventEmitter<boolean> = new EventEmitter();


  public checked = (item: TreeItem) => item.is_selected == true;
  public search: string = "";
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========

  // #region ==========> PUBLIC METHODS <==========
  public onExpand(item: TreeItem): void {
    if (item.expanded) {
      item.expanded = !item.expanded;
      return;
    } else {
      if (item.children) {
        if (item.children.length > 0) {
          item.expanded = true;
        } else {
          item.expanded = false;
        }
      }
    }
  }

  public onCheck(items: TreeItem[], item: TreeItem): void {
    if (item.has_children && item.children) {
      item.children.forEach((firstNode) => {
        if (firstNode.is_selected != item.is_selected) {
          firstNode.is_selected = !firstNode.is_selected;
        }
        if (firstNode.has_children && firstNode.children) {
          firstNode.children.forEach((secondNode) => {
            if (secondNode.is_selected != firstNode.is_selected) {
              secondNode.is_selected = !secondNode.is_selected;
            }
          });
        }
      });
    }

    if (this.indeterminateCheck(items)) {
      this.onSelect.emit(true);
    } else if (!this.indeterminateCheck(items)) {
      this.onSelect.emit(false);
    }
  }
  // #endregion ==========> PUBLIC METHODS <==========

  // #region ==========> PRIVATE METHODS <==========

  private indeterminateCheck(list: TreeItem[]): boolean {
    return list.some(this.checked);
  }

  // private allCheck(list: TreeItem[]): boolean {
  //   return list.every(this.checked);
  // }
  // #endregion ==========> PRIVATE METHODS <==========
}
