import { Directive } from '@angular/core';

/**
 * Diretiva de marcação usada pelo componente lib-combobox.
 *
 * Nas versões modernas do Angular, consultas de conteúdo (`@ContentChild` / `@ContentChildren`)
 * não conseguem mais localizar elementos apenas por seletores CSS, como `[btnLeft]` ou `[btnRight]`.
 * Isso significa que, mesmo que o conteúdo seja projetado corretamente no HTML com:
 * ```html
 * <button btnLeft></button>
 * ```
 *
 * o Angular não consegue associar esse elemento a um `@ContentChild('[btnLeft]')`.
 *
 * Para que a query funcione, o framework exige um “token” estático — normalmente uma diretiva.
 * Por isso esta diretiva existe: ela atua como um identificador explícito para o Angular.
 *
 * Assim, quando o desenvolvedor usa `btnLeft` no componente pai, o Angular passa a enxergar
 * aquele elemento através de `@ContentChild(BtnLeftDirective)`, permitindo validar, manipular
 * ou reagir à presença do botão projetado.
*/
@Directive({
  selector: '[btnLeft]'
})
export class BtnLeftDirective {

  constructor() { }

}
