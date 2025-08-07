import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[innerRows]'
})
export class InnerRowsDirective {

  @Input("innerRows") public innerRows?: string | null;
  
  constructor(
    /** Referência ao elemento DOM ao qual a diretiva está associada. */
    private _elementRef: ElementRef<HTMLTableRowElement>,
  ) { }

  ngOnInit(): void {
    this.break();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    
  }


  /** Define a largura do elemento com base na quantidade fornecida e depois aplica o ellipsis (...) no lugar do conteúdo que foi cortado. */
  protected break(): void {
    let matchingTableCells: NodeListOf<Element> = this._elementRef.nativeElement.querySelectorAll('td > span')
    console.log(matchingTableCells);
  }

}
