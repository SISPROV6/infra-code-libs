import { Component, HostBinding, HostListener } from '@angular/core';

@Component({
  selector: 'lib-loading-screen',
  standalone: true,
  imports: [],
  templateUrl: './loading-screen.component.html',
  styles: `
    .loader-background {
      z-index: 1999;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background-color:rgba(255, 255, 255, 0.75) !important;
    }
    .loader-content {
      opacity: 100% !important;
      height: 100%;
    }
  `
})
export class LoadingScreenComponent {

  // #region ==========> PROPERTIES <==========

  // #region PUBLIC

  /** Indica se devo bloquear o unload do navegador quando ativo */
  public blockUnload: boolean = false;

  
  @HostBinding('class.h-100')


  /** 
   * Esse método será chamado sempre que o usuário tentar fechar/atualizar a aba
   * O retorno false (ou atribuir event.returnValue) impede o unload.
   */
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (this.blockUnload) {
      // Navegadores recentes ignoram a mensagem customizada, mas exibem um alerta padrão
      event.preventDefault();

      // Incluído para suporte legado, e.g. Chrome/Edge < 119
      event.returnValue = true;
    }
  }
  
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor() { }


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
