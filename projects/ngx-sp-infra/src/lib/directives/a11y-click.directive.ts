import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Diretiva `libA11yClick`
 *
 * Torna elementos clicáveis acessíveis via teclado, emitindo um único evento (`a11yClick`)
 * tanto ao clicar com o mouse quanto ao pressionar Enter ou Espaço.
 *
 * 🔧 Antes de usar:
 * - Use em elementos interativos como `<button>`, `<div>` ou `<span>`.
 * - Para elementos não-nativos, adicione `tabindex="0"` para permitir foco via teclado.
 *
 * 📤 Output:
 * @Output() a11yClick - Evento emitido ao clicar ou pressionar Enter/Espaço.
 *
 * 🧠 Exemplo de uso:
 * ```html
 * <button libA11yClick (a11yClick)="executarAcao()">Salvar</button>
 * <div libA11yClick tabindex="0" (a11yClick)="executarAcao()">Ação acessível</div>
 * ```
 *
 * 🧪 Testes sugeridos:
 * - Deve emitir ao `click`
 * - Deve emitir ao `keyup.enter`
 * - Deve emitir ao `keyup.space` (opcional)
 * - Não deve emitir para outras teclas
*/
@Directive({
  selector: '[libA11yClick]',
  standalone: true
})
export class A11yClickDirective {

  /** Evento emitido ao clicar ou pressionar Enter/Espaço. */
  @Output() a11yClick = new EventEmitter<MouseEvent | KeyboardEvent>();

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent): void {
    this.a11yClick.emit(event);
  }

  @HostListener('keyup.enter', ['$event'])
  handleKeyup(event: KeyboardEvent): void {
    this.a11yClick.emit(event);
  }

}
