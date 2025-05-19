/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { LoadingScreenComponent } from '../widgets/loading-screen/loading-screen.component';

@Injectable({ providedIn: 'root' })
export class GlobalLoadingService {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _componentRef: ComponentRef<LoadingScreenComponent> | null = null;
  // #endregion PRIVATE

  // #endregion ==========> PROPERTIES <==========


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }


  // #region ==========> UTILS <==========

  /**
   * Exibe o loading na tela.
   * @param blockUnload Indica se deve bloquear o unload do navegador enquanto o loading estiver sendo exibido. Recomenda-se usar true em casos de ações de Salvar/Atualizar.
   */
  public show(blockUnload: boolean = false): void {
    // Já existe o componente anexado
    if (this._componentRef) { return; }

    // 1. Resolve a fábrica do componente
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LoadingScreenComponent);
    
    // 2. Cria a instância no contexto do injector raiz
    this._componentRef = componentFactory.create(this.injector);

    // 2.1. Passa o parâmetro blockUnload para o componente
    this._componentRef.instance.blockUnload = blockUnload;
    
    // 3. Anexa a view à ApplicationRef para que faça parte do ciclo de detecção de mudanças
    this.appRef.attachView(this._componentRef.hostView);
    
    // 4. Converte a view em nó DOM e adiciona ao body
    const domElem = (this._componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

  public hide(): void {
    if (!this._componentRef) { return; }

    // Remove do ciclo de detecção de mudanças e do DOM
    this.appRef.detachView(this._componentRef.hostView);
    this._componentRef.destroy();
    this._componentRef = null;
  }
  // #endregion ==========> UTILS <==========

}
