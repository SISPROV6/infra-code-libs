import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { ITelaRota, SearchInputComponent } from 'ngx-sp-infra';
import { Subject, Subscription } from 'rxjs';

/**
 * Serviço responsável por criar e gerenciar uma instância global do componente SearchInput.
 * 
 * Este serviço utiliza a API do Angular para criar e renderizar componentes dinamicamente,
 * anexando-os diretamente ao DOM (fora da hierarquia normal de componentes).
 * 
 * Características principais:
 * - Cria apenas uma instância do componente por vez (singleton)
 * - Gerencia o ciclo de vida do componente (criação, anexação ao DOM, destruição)
 * - Lida com eventos do componente via RxJS Subjects
 * - Garante limpeza apropriada de recursos (subscriptions, referencias DOM)
 * 
 * @example
 * constructor(private pesquisaService: PesquisaTelasGlobalService) {
 *   // Para exibir o componente de pesquisa
 *   pesquisaService.show();
 * 
 *   // Para esconder o componente
 *   pesquisaService.hide();
 * }
 */
@Injectable({ providedIn: 'root' })
export class PesquisaTelasGlobalService {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  /**
   * Referência ao componente dinâmico criado.
   * Usado para gerenciar o ciclo de vida e estado do componente.
   * Null quando o componente não está visível/criado.
  */
  private _componentRef?: ComponentRef<SearchInputComponent> | null = null;

  /**
   * Subject que centraliza eventos de fechamento do componente.
   * Ao invés de tratar o evento onClose diretamente, emitimos neste Subject para permitir um ponto único de tratamento no serviço.
  */
  private _onClose$ = new Subject<void>();

  /**
   * Agregador de subscriptions de longa duração.
   * Contém principalmente a inscrição do constructor que observa _onClose$.
   * Usado para garantir limpeza adequada em ngOnDestroy.
  */
  private _subscriptions: Subscription = new Subscription();

  /**
   * Subscription específica do evento onClose do componente atual.
   * Mantida separadamente para permitir limpeza imediata em hide().
   * Null quando não há componente ativo.
  */
  private _componentCloseSub: Subscription | null = null;
  // #endregion PRIVATE

  // #region PUBLIC
  public telas: ITelaRota[] = [];
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {

    // Inscreve uma vez no Subject que receberá os eventos onClose dos componentes
    // Quando recebermos, executamos a ação desejada (aqui, esconder o componente)
    if (this._onClose$) {
      this._subscriptions.add(
        this._onClose$.subscribe(() => this.hide())
      );
    }

  }


  // #region ==========> API METHODS <==========

  // #region GET

  public getTelas(): void {
    this.telas = [];
  }

  // #endregion GET

  // #region POST
  // [...]
  // #endregion POST

  // #endregion ==========> API METHODS <==========


  // #region ==========> UTILS <==========
  
  /**
   * Cria e exibe uma instância do componente SearchInput na tela.
   * 
   * Este método utiliza a API baixo nível do Angular para criar um componente dinamicamente e anexá-lo ao DOM. O processo envolve:
   * 
   * 1. Criar o componente via ComponentFactoryResolver
   * 2. Configurar suas propriedades iniciais
   * 3. Registrá-lo no mecanismo de detecção de mudanças do Angular
   * 4. Anexá-lo ao DOM (fora da hierarquia normal de componentes)
   * 
   * IMPORTANTE: Este método garante que apenas uma instância do componente existe por vez, retornando early se já houver um componente ativo.
   * 
   * @example
   * service.show(); // Cria e exibe o componente
   * service.show(); // Não faz nada (componente já existe)
  */
  public show(): void {
    // Garante que apenas uma instância existe por vez
    if (this._componentRef) { return; }

    // 1. Resolve a fábrica do componente - primeiro passo para criar
    // um componente dinamicamente no Angular. A fábrica contém os metadados
    // necessários para instanciar o componente.
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SearchInputComponent);
    
    // 2. Cria uma nova instância do componente usando o injector raiz
    // Isso garante que o componente tenha acesso aos mesmos serviços
    // que componentes criados normalmente via template
    this._componentRef = componentFactory.create(this.injector);

    // 2.1. Configura o estado inicial do componente
    this._componentRef.instance.isVisible = true;
    // this._componentRef.instance.customItems = this.telas;
    
    // 3. Registra a view do componente no ApplicationRef
    // Isso é CRÍTICO: sem este passo, o componente não participaria
    // do ciclo de detecção de mudanças do Angular
    this.appRef.attachView(this._componentRef.hostView);
    
    // 4. Obtém o elemento DOM raiz do componente e o anexa ao body
    // Como este componente é criado fora da hierarquia normal,
    // precisamos anexá-lo manualmente ao DOM
    const domElem = (this._componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // Em vez de tratar o hide() diretamente aqui, encaminhamos o evento para o Subject _onClose$
    // e guardamos a subscription para poder removê-la quando escondermos o componente.
    this._componentCloseSub = this._componentRef.instance.onClose.subscribe(() => this._onClose$.next());
  }

  /**
   * Esconde e destrói a instância atual do componente.
   * 
   * Este método realiza a limpeza completa do componente:
   * 1. Define isVisible como false (para animações de saída)
   * 2. Remove o componente do ciclo de detecção de mudanças
   * 3. Destrói o componente e sua árvore de componentes
   * 4. Remove referências e cancela inscrições
   * 
   * IMPORTANTE: Este método é idempotente - é seguro chamá-lo múltiplas vezes ou quando não há componente ativo.
  */
  public hide(): void {
    if (!this._componentRef) { return; }

    // Sinaliza que o componente deve ficar invisível
    // Útil se houver animações de saída
    this._componentRef.instance.isVisible = false;

    // Remove do ciclo de detecção de mudanças e do DOM
    // Estes passos são críticos para evitar memory leaks:
    // 1. detachView remove do ciclo de detecção de mudanças
    // 2. destroy limpa event handlers e remove do DOM
    this.appRef.detachView(this._componentRef.hostView);
    this._componentRef.destroy();
    this._componentRef = null;

    // Cancela a inscrição no evento onClose do componente
    // Isso é necessário mesmo que o componente seja destruído,
    // pois a subscription pode manter referências vivas
    if (this._componentCloseSub) {
      this._componentCloseSub.unsubscribe();
      this._componentCloseSub = null;
    }
  }

  /**
   * Lifecycle hook do Angular chamado quando o serviço é destruído.
   * 
   * Realiza limpeza completa de recursos para evitar memory leaks:
   * 1. Destrói qualquer instância ativa do componente
   * 2. Cancela todas as inscrições de longa duração
   * 3. Completa o Subject de eventos
   * 
   * NOTA: Como este serviço é providedIn: 'root', ele normalmente
   * só será destruído quando a aplicação for encerrada. Ainda assim,
   * manter essa limpeza é uma boa prática e ajuda em testes.
  */
  public ngOnDestroy(): void {
    // Tenta esconder/destruir componente ativo se houver
    // Wrapped em try/catch pois pode haver erros ao destruir
    // o componente se a aplicação estiver sendo encerrada
    if (this._componentRef) {
      try { this.hide(); } catch (e) { /* ignora */ }
    }

    // Cancela todas as inscrições de longa duração
    // (principalmente a inscrição em _onClose$ feita no constructor)
    this._subscriptions.unsubscribe();

    // Completa o Subject de eventos
    // Isso notifica todos os observadores que não haverá mais eventos
    this._onClose$.complete();
  }

  // #endregion ==========> UTILS <==========

}
