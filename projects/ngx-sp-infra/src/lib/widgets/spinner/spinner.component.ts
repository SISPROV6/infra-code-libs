import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'lib-spinner',
    template: `
    <div class="spinner-{{type}} {{theme ? 'text-'+theme : ''}} {{size}}" role="status">
      <span class="visually-hidden">{{ text }}</span>
    </div>
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
  protected _size?: string;
  // #endregion PROTECTED

  // #region PUBLIC

  /** Tipo do spinner
   * @default "border" */
  @Input() public type: "border" | "grow" = "border";

  /** Tema de cor do spinner */
  @Input() public theme?: "primary" | "secondary" | "success" | "danger" | "warning";

  /** Tamanho do spinner (Padrão ou pequeno)
   * @default "default" */
  @Input() public size: "default" | "small" = "default";

  /** Texto de ajuda, será exibido no hover em cima do spinner
   * @default "Carregando informações..." */
  @Input() public text: string = "Carregando informações...";
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["spinnerSize"]) {
      if (this.size === "small") this._size = `spinner-${this.type}-sm`;
      else if (this.size === "default") delete this._size;
    }
  }
  // #endregion ==========> INITIALIZATION <==========

}
