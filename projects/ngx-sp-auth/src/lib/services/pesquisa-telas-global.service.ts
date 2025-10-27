import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';

import { RetError, SearchInputComponent } from 'ngx-sp-infra';
import { debounceTime, distinctUntilChanged, filter, Observable, Subject, Subscription, switchMap, take, tap } from 'rxjs';

import { LibCustomEnvironmentService } from '../custom/lib-custom-environment.service';
import { RetTelasPesquisa } from '../models/ret-telas-pesquisa.model';
import { ProjectUtilservice } from '../project/project-utils.service';

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

  // #region GERENCIAMENTO DINÂMICO DO COMPONENTE

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
   * Subject que centraliza eventos de pesquisa do componente.
   * Ao invés de tratar o evento onSearch diretamente, emitimos neste Subject para permitir um ponto único de tratamento no serviço.
  */
  private _onSearch$ = new Subject<string>();

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
  
  /**
   * Subscription específica do evento onSearch do componente atual.
   * Null quando não há componente ativo.
  */
  private _componentSearchSub: Subscription | null = null;

  // #endregion GERENCIAMENTO DINÂMICO DO COMPONENTE

  private readonly _BASE_URL: string = `${ this._customEnvironmentService.Sp2LocalhostWS }/PesquisaGlobalTela`; // SpInfra2ErpWS
  private readonly _HTTP_HEADERS = new HttpHeaders().set('Content-Type', 'application/json');

  // #endregion PRIVATE

  // #region PUBLIC

  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,

    private _httpClient: HttpClient,
    private _customEnvironmentService: LibCustomEnvironmentService,
    private _projectUtils: ProjectUtilservice,
  ) {

    this._BASE_URL = this._customEnvironmentService.production
      ? `${ this._customEnvironmentService.SpInfra2ErpWS }/PesquisaGlobalTela`
      : this._BASE_URL;

    // Inscreve uma vez no Subject que receberá os eventos onClose dos componentes
    // Quando recebermos, executamos a ação desejada (aqui, esconder o componente)
    if (this._onClose$) {
      this._subscriptions.add(
        this._onClose$.subscribe(() => this.hide())
      );
    }

    // Inscreve uma vez no Subject que receberá os eventos onSearch dos componentes
    // Quando recebermos, executamos a ação desejada (aqui, chamar o backend)
    if (this._onSearch$) {
      this._subscriptions.add(
        this._onSearch$
          .pipe(
            debounceTime(500),  // Aguarda 500ms de "silêncio" antes de emitir
            distinctUntilChanged(), // Emite apenas se o valor mudou desde a última emissão
            filter(pesquisa => pesquisa.length >= 3), // Emite apenas se a quantidade de caracteres da pesquisa for maior que 3
            switchMap(pesquisa => this.getTelas(pesquisa) ) // Cancela a chamada anterior se uma nova pesquisa chegar
          )
          .subscribe({
            next: res => {
              this._componentRef!.instance.loading = false;

              this._componentRef!.instance.telas = res.MenuSubmenuTela.Telas;
              this._componentRef!.instance.menus = res.MenuSubmenuTela.Menus;
              this._componentRef!.instance.submenus = res.MenuSubmenuTela.Submenus;
            },
            error: err => {
              this._componentRef!.instance.loading = false;
              this._projectUtils.showHttpError(err);
            }
          })
          
      );
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
    // Wrapped em try/catch pois pode haver erros ao destruir o componente se a aplicação estiver sendo encerrada
    if (this._componentRef) {
      try { this.hide(); } catch (e) { /* ignora */ }
    }

    // Cancela todas as inscrições de longa duração
    this._subscriptions.unsubscribe();

    // Completa os Subjects de eventos
    // Isso notifica todos os observadores que não haverá mais eventos
    this._onClose$.complete();
    this._onSearch$.complete();
  }


  // #region ==========> API METHODS <==========

  // #region GET

  /**
   * Método responsável pela busca por telas via API.
   * 
   * @param pesquisa Termo de pesquisa para filtrar as telas.
   * @returns Observable emitindo o resultado da pesquisa de telas.
  */
  public getTelas(pesquisa: string): Observable<RetTelasPesquisa> {

    // Sempre que iniciar uma nova pesquisa seta o loading para true para melhor feedback para o usuário
    if (this._componentRef) this._componentRef!.instance.loading = true;

    const params = new HttpParams().set('pesquisa', pesquisa);
    const url = `${ this._BASE_URL }`;

    return this._httpClient.get<RetTelasPesquisa>(url, { 'params': params, 'headers': this._HTTP_HEADERS })
      .pipe(take(1), tap(response => this.showErrorMessage(response) ));
  }

  // #endregion GET

  // #endregion ==========> API METHODS <==========


  // #region ==========> UTILS <==========
  
  // #region GERENCIAMENTO DO COMPONENTE

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
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(SearchInputComponent);
    
    // 2. Cria uma nova instância do componente usando o injector raiz
    // Isso garante que o componente tenha acesso aos mesmos serviços
    // que componentes criados normalmente via template
    this._componentRef = componentFactory.create(this._injector);
    
    // 3. Registra a view do componente no ApplicationRef
    // Isso é CRÍTICO: sem este passo, o componente não participaria
    // do ciclo de detecção de mudanças do Angular
    this._appRef.attachView(this._componentRef.hostView);
    
    // 4. Obtém o elemento DOM raiz do componente e o anexa ao body
    // Como este componente é criado fora da hierarquia normal,
    // precisamos anexá-lo manualmente ao DOM
    const domElem = (this._componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // 5. Configura os listeners dos eventos do componente
    // Em vez de tratar o hide() diretamente aqui, encaminhamos o evento para o Subject _onClose$ e guardamos a subscription para poder removê-la quando escondermos o componente.
    this._componentCloseSub = this._componentRef.instance.onClose.subscribe(() => this._onClose$.next());

    // Em vez de tratar o getTelas() diretamente aqui, encaminhamos o evento para o Subject _onSearch$ e guardamos a subscription para poder removê-la quando escondermos o componente.
    this._componentSearchSub = this._componentRef.instance.onSearch.subscribe(pesquisa => this._onSearch$.next(pesquisa));
  }

  /**
   * Esconde e destrói a instância atual do componente.
   * 
   * Este método realiza a limpeza completa do componente:
   * 1. Remove o componente do ciclo de detecção de mudanças
   * 2. Destrói o componente e sua árvore de componentes
   * 3. Remove referências e cancela inscrições
   * 
   * IMPORTANTE: Este método é idempotente - é seguro chamá-lo múltiplas vezes ou quando não há componente ativo.
  */
  public hide(): void {
    if (!this._componentRef) { return; }

    // Remove do ciclo de detecção de mudanças e do DOM
    // Estes passos são críticos para evitar memory leaks:
    // 1. detachView remove do ciclo de detecção de mudanças
    // 2. destroy limpa event handlers e remove do DOM
    this._appRef.detachView(this._componentRef.hostView);
    this._componentRef.destroy();
    this._componentRef = null;

    // Cancela a inscrição no evento onClose do componente
    // Isso é necessário mesmo que o componente seja destruído,
    // pois a subscription pode manter referências vivas
    if (this._componentCloseSub) {
      this._componentCloseSub.unsubscribe();
      this._componentCloseSub = null;
    }

    // Cancela a inscrição no evento onSearch do componente
    // Isso é necessário mesmo que o componente seja destruído, pois a subscription pode manter referências vivas
    if (this._componentSearchSub) {
      this._componentSearchSub.unsubscribe();
      this._componentSearchSub = null;
    }
  }

  // #endregion GERENCIAMENTO DO COMPONENTE

  private showErrorMessage(response: RetError): void { if (response.Error) throw Error(response.ErrorMessage); }

  // #endregion ==========> UTILS <==========

}