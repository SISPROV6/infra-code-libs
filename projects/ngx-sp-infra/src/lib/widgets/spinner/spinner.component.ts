import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'lib-spinner',
    template: `
    @switch (sizeType) {
      @case ("class") {
        <div class="spinner-{{type}} {{theme ? 'text-'+theme : ''}} {{_size}}" role="status">
          <span class="visually-hidden">{{ helperText }}</span>
        </div>
      }
      @case ("custom") {
        <div class="spinner-{{type}} {{theme ? 'text-'+theme : ''}}" [style.height.px]="_size" [style.width.px]="_size" role="status">
          <span class="visually-hidden">{{ helperText }}</span>
        </div>
      }
    }
  `,
    styles: ``,
    standalone: true
})
export class LibSpinnerComponent implements OnChanges {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  // [...]
  // #endregion PRIVATE

  // #region PROTECTED
  protected _size?: string | number;

  protected sizeType: "class" | "custom" = "class";
  // #endregion PROTECTED

  // #region PUBLIC

  /** Tipo do spinner
   * @default "border" */
  @Input() public type: "border" | "grow" = "border";

  /** Tema de cor do spinner */
  @Input() public theme?: "primary" | "secondary" | "success" | "danger" | "warning";

  /** Tamanho do spinner (Padrão ou pequeno)
   * @default "default" */
  @Input() public size: "default" | "small" | number = "default";

  /** Texto de ajuda, será exibido no hover em cima do spinner
   * @default "Carregando informações..." */
  @Input() public helperText: string = "Carregando informações...";
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["size"]) {
      this.getSize();
    }
  }
  // #endregion ==========> INITIALIZATION <==========


  private getSize(): void {
    if (this.size === "small") {
      this.sizeType = "class";
      this._size = `spinner-${this.type}-sm`;
    }
    else if (this.size === "default") {
      this.sizeType = "class";
      delete this._size;
    }
    else {
      this.sizeType = "custom";
      this._size = this.size;
    }
    
  }

}
