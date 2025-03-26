import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[libTextTruncate], [textTruncate]'
})
export class TextTruncateDirective implements OnInit, OnChanges {

  private formatType = (): string => { return typeof this.truncateLimit === 'string' ? this.truncateLimit : `${this.truncateLimit}px`; }
  // private applyTooltip = (): void => { this._elementRef.nativeElement.setAttribute('tooltip', this._elementRef.nativeElement.innerText); }
  
  constructor(
    /** Referência ao elemento DOM ao qual a diretiva está associada. */
    private _elementRef: ElementRef<HTMLSpanElement>,
  ) { }

  /** Se um valor for informado, deve cortar o texto com base em uma largura determinada e em seu lugar deve aplicar o ellipsis "...".
   * 
   * @param value - Aceita valores numéricos para definir a largura em pixels e string com sinal de porcentagem
   * @example  ```html
   <span [libTextTruncate]="500"> Isto cortará o texto em "500px" fixos </span>
   ```
   * @example ```html
   <span [textTruncate]="'75%'"> Isto cortará o texto em 75% da largura do elemento pai </span>
   ```
  */
  @Input("libTextTruncate") public truncateLimit?: number | string;

  private _elementID?: string;

  ngOnInit(): void {
    this._elementID = `truncated-text-${Math.random() * 100}`;
    if (this.truncateLimit) this.truncate();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["libTextTruncate"]?.currentValue !== changes["libTextTruncate"]?.previousValue && changes["libTextTruncate"]?.previousValue !== undefined) {
      if (this.truncateLimit) this.truncate();
    }
  }


  /** Define a largura do elemento com base na quantidade fornecida e depois aplica o ellipsis (...) no lugar do conteúdo que foi cortado. */
  protected truncate(): void {
    this._elementRef.nativeElement.id = this._elementID!;

    this._elementRef.nativeElement.style.display = 'block';
    this._elementRef.nativeElement.style.overflow = 'hidden';
    this._elementRef.nativeElement.style.textOverflow = 'ellipsis';
    this._elementRef.nativeElement.style.whiteSpace = 'nowrap';
    this._elementRef.nativeElement.style.maxWidth = this.formatType();
  }

}
