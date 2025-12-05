import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDBService, ObjectToStore } from '@path/to/indexed-db.service';

/**
 * Interface que define a estrutura dos filtros salvos para a lista de usuários
 */
interface UsuariosFilterData {
  pesquisa: string;
  isActive: boolean;
  page: number;
  itemsPerPage: number;
}

/**
 * Exemplo de componente com uso CORRETO do IndexedDBService
 * 
 * IMPORTANTE:
 * - ❌ NÃO chame initializeDatabase() no constructor
 * - ✅ Chame COM AWAIT no ngOnInit()
 * - ✅ Sempre use try/catch ao operar com IndexedDB
 */
@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit, OnDestroy {

  // Filtros
  textoPesquisa: string = '';
  isActive: boolean = true;
  page: number = 1;
  itemsPerPage: number = 10;

  // Estado
  isLoading: boolean = true;
  usuarios: any[] = [];
  totalUsuarios: number = 0;
  error: string | null = null;

  // Flag para tracking
  private _isIndexedDBInitialized = false;

  constructor(
    private _indexedDB: IndexedDBService,
    private _router: Router
  ) {
    // ✅ VAZIO - Não inicialize aqui
  }

  /**
   * ✅ CORRETO: Aguarda inicialização do IndexedDB com await
   */
  async ngOnInit() {
    try {
      // 1️⃣ PRIMEIRO: Inicializar IndexedDB com await
      await this._indexedDB.initializeDatabase();
      this._isIndexedDBInitialized = true;

      // 2️⃣ SEGUNDO: Buscar filtros salvos ou criar placeholder
      await this._restoreFilters();

      // 3️⃣ TERCEIRO: Carregar dados com os filtros restaurados
      await this.getUsuariosList();

    } catch (error) {
      console.error('Erro ao inicializar componente:', error);
      this.error = 'Erro ao carregar filtros. Recarregando com valores padrão...';
      
      // Fallback: Carregar dados com valores padrão
      try {
        await this.getUsuariosList();
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
        this.error = 'Erro ao carregar usuários. Tente recarregar a página.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Restaura os filtros salvos do IndexedDB ou cria um placeholder
   */
  private async _restoreFilters(): Promise<void> {
    if (!this._isIndexedDBInitialized) {
      throw new Error('IndexedDB não está inicializado');
    }

    try {
      const filterValue: ObjectToStore<UsuariosFilterData> = {
        key: 'usuarios-filter',
        context: 'usuarios-list',
        payload: {
          pesquisa: '',
          isActive: true,
          page: 1,
          itemsPerPage: 10
        }
      };

      // validate() busca se existe ou cria placeholder
      const restored = await this._indexedDB.validate('usuarios-filter', filterValue);

      if (restored) {
        this.textoPesquisa = restored.pesquisa;
        this.isActive = restored.isActive;
        this.page = restored.page;
        this.itemsPerPage = restored.itemsPerPage;
      }
    } catch (error) {
      // Se erro ao restaurar, usa valores padrão (já estão setados no componente)
      console.warn('Erro ao restaurar filtros, usando valores padrão:', error);
    }
  }

  /**
   * ✅ CORRETO: Carrega usuários e salva os filtros
   * 
   * Esta método é seguro para ser chamado múltiplas vezes,
   * pois IndexedDB já foi inicializado em ngOnInit()
   */
  async getUsuariosList(search: string = this.textoPesquisa) {
    if (!this._isIndexedDBInitialized) {
      console.warn('IndexedDB não foi inicializado. Pulando salvamento de filtros.');
      return;
    }

    try {
      this.textoPesquisa = search;
      this.page = 1; // Reset page quando faz nova busca
      
      // Atualizar filtros no IndexedDB
      await this._updateFiltersInIndexedDB();

      // Aqui você faria a requisição para o backend
      // const response = await this._usuariosService.getUsuarios({
      //   search: this.textoPesquisa,
      //   isActive: this.isActive,
      //   page: this.page,
      //   itemsPerPage: this.itemsPerPage
      // });

      // Mock para demonstração
      this.usuarios = [];
      this.totalUsuarios = 0;
      this.error = null;

    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      this.error = 'Erro ao carregar usuários. Tente novamente.';
    }
  }

  /**
   * ✅ CORRETO: Usa update() que garante sincronização
   */
  private async _updateFiltersInIndexedDB(): Promise<void> {
    if (!this._isIndexedDBInitialized) {
      return;
    }

    try {
      await this._indexedDB.update({
        key: 'usuarios-filter',
        context: 'usuarios-list',
        payload: {
          pesquisa: this.textoPesquisa,
          isActive: this.isActive,
          page: this.page,
          itemsPerPage: this.itemsPerPage
        }
      });
    } catch (error) {
      // Não lance erro, apenas log. O componente continua funcionando mesmo sem salvamento.
      console.warn('Erro ao salvar filtros no IndexedDB:', error);
    }
  }

  /**
   * Quando usuário muda página
   */
  async onPageChange(newPage: number) {
    this.page = newPage;
    await this.getUsuariosList();
  }

  /**
   * Quando usuário muda o filtro de ativo/inativo
   */
  async onActiveToggle() {
    this.isActive = !this.isActive;
    await this.getUsuariosList();
  }

  /**
   * Quando usuário clica logout
   * 
   * ⚠️ IMPORTANTE: Este método deve ser chamado em um AuthService ou Guard
   * durante o logout, NÃO no componente
   */
  async onLogout() {
    try {
      // 1️⃣ Fecha a conexão aberta
      await this._indexedDB.closeOpenConnection();

      // 2️⃣ Deleta a database
      await this._indexedDB.deleteDatabase();

      // 3️⃣ Navega para login
      this._router.navigate(['/login']);

    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, tenta navegar
      this._router.navigate(['/login']);
    }
  }

  /**
   * ✅ IMPORTANTE: Cleanup quando componente é destruído
   * 
   * Nota: NÃO precisa fechar a conexão aqui, pois ela é persistente.
   * A conexão fica aberta até deleteDatabase() ou logout.
   */
  ngOnDestroy() {
    // Se necessário fazer cleanup específico:
    // Por exemplo, cancelar subscriptions, etc.
  }

}
