import { Injectable } from '@angular/core';
import { deleteDB, IDBPDatabase, openDB } from 'idb';
import { LibCustomEnvironmentService } from '../custom/lib-custom-environment.service';

/**
 * Tipo estruturado que deve ser enviado e recebido quando utilizar o armazenamento de valores no IndexedDB
*/
export type ObjectToStore<T> = {
  /** Valor da chave-única para diferenciar entre outros valores salvos */
  key: string;

  /** Contexto da tela em que a implementação está inserida */
  context: string;

  /**
   * Corpo do que será de fato armazenado, filtros, formulários, etc.
   * O tipo usado é genérico e deve ser informado caso deseje utilizar este tipo no seu componente.
  */
  payload?: T;
}

/**
 * Mecanismo simples de lock para evitar race conditions
 * Garante que apenas uma operação crítica (init/delete) execute por vez
 */
class DatabaseLock {
  private isLocked = false;
  private queue: Array<() => Promise<void>> = [];

  async acquire<T>(operation: () => Promise<T>): Promise<T> {
    while (this.isLocked) {
      // Aguarda até que a lock seja liberada
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    this.isLocked = true;
    try {
      return await operation();
    } finally {
      this.isLocked = false;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _restored?: ObjectToStore<any>;
  private _dbName: string = "Sp_Filtros_";
  private _lock = new DatabaseLock();
  private _isInitialized = false;
  private _initPromise?: Promise<void>;
  // #endregion PRIVATE

  protected request?: IDBPDatabase<unknown>;

  // #endregion ==========> PROPERTIES <==========


  constructor( private _customEnvironment: LibCustomEnvironmentService ) {
    if (!window.indexedDB) {
      alert("Seu navegador não suporta uma versão estável do IndexedDB. Salvamento de filtros em sessão não estará disponível.");
    }

    this._dbName = `Sp_${ _customEnvironment.product ?? 'Modelo' }_Filtros`;
  }


  // #region ==========> ACTIONS <==========

  // #region ADD

  /**
   * Cria um registro dentro de um objectStore.
   * O valor a ser inserido precisa ser um objeto com pelo **menos a propriedade `key`**, ela é a nossa *chave-primária* dos registros
   * 
   * @param value Valor a ser inserido
   */
  async add(value: ObjectToStore<any>): Promise<void> {
    await this._ensureInitialized();
    
    if (!this.request) {
      throw new Error('Database not initialized. Call initializeDatabase() first.');
    }

    try {
      await this.request.add('filters', value);
    } catch (error) {
      console.error('Error adding value to IndexedDB:', error);
      throw error;
    }
  }

  // #endregion ADD

  // #region GET

  /**
   * Busca um valor na base dentro de um objectStore.
   * 
   * @param key Valor da chave única
   * @returns Promise<> com o valor encontrado ou undefined se não encontrar
   */
  async get(key: string): Promise<ObjectToStore<any>> {
    await this._ensureInitialized();
    
    if (!this.request) {
      throw new Error('Database not initialized. Call initializeDatabase() first.');
    }

    try {
      return await this.request.get('filters', key);
    } catch (error) {
      console.error('Error getting value from IndexedDB:', error);
      throw error;
    }
  }

  // #endregion GET

  // #region UPDATE

  /**
   * Atualiza o valor de um registro dentro de um objectStore.
   * 
   * @param value Valor atualizado
   */
  async update(value: ObjectToStore<any>): Promise<void> {
    await this._ensureInitialized();
    
    if (!this.request) {
      throw new Error('Database not initialized. Call initializeDatabase() first.');
    }

    try {
      await this.request.put('filters', value);
    } catch (error) {
      console.error('Error updating value in IndexedDB:', error);
      throw error;
    }
  }

  // #endregion UPDATE

  // #region DELETE

  /**
   * Exclui um registro na base dentro de um objectStore.
   * 
   * @param key Valor da chave única
   */
  async delete(key: string): Promise<void> {
    await this._ensureInitialized();
    
    if (!this.request) {
      throw new Error('Database not initialized. Call initializeDatabase() first.');
    }

    try {
      await this.request.delete('filters', key);
    } catch (error) {
      console.error('Error deleting value from IndexedDB:', error);
      throw error;
    }
  }

  // #endregion DELETE

  // #endregion ==========> ACTIONS <==========


  // #region ==========> UTILS <==========

  /**
   * Garante que a database foi inicializada antes de usar qualquer operação.
   * Se `initializeDatabase()` foi chamado mas ainda não completou, aguarda a promise.
   * Previne race conditions ao tentar usar operações durante a inicialização.
   * 
   * @private
   */
  private async _ensureInitialized(): Promise<void> {
    // Se já está inicializando, aguarda a promise existente
    if (this._initPromise) {
      await this._initPromise;
      return;
    }

    // Se já foi inicializado com sucesso, retorna imediatamente
    if (this._isInitialized && this.request) {
      return;
    }

    // Se chegou aqui e não está inicializado, significa que initializeDatabase() não foi chamado
    throw new Error(
      'IndexedDB not initialized. Call initializeDatabase() and await it before using any operations.'
    );
  }

  /**
   * Inicializa as configurações iniciais do IndexedDB e já cria o objectStore que será utilizado caso não exista.
   * 
   * ⚠️ IMPORTANTE: Deve ser chamado com `await` no ngOnInit() do seu componente, não no constructor!
   * 
   * O object store que será criado terá sua chave inline na propriedade `key` e o índice será a propriedade `context`, 
   * portanto todos os valores que forem inseridos **DEVEM** ser um objeto com pelo menos a propriedade `key` e `context`.
   * 
   * @example
   * async ngOnInit() {
   *   await this._indexedDB.initializeDatabase();
   *   const restored = await this._indexedDB.get('minha-chave');
   * }
  */
  public async initializeDatabase(): Promise<void> {
    return this._lock.acquire(async () => {
      // Se já está inicializado, não refaz
      if (this._isInitialized && this.request) {
        return;
      }

      // Marca que está inicializando
      const initPromise = this._performInitialization();
      this._initPromise = initPromise;

      try {
        await initPromise;
        this._isInitialized = true;
      } finally {
        this._initPromise = undefined;
      }
    });
  }

  /**
   * Executa a inicialização real da database.
   * @private
   */
  private async _performInitialization(): Promise<void> {
    try {
      this.request = await openDB(this._dbName, 1, {
        upgrade(db) {
          // Criar objectStore se não houver um mesmo com este nome
          if (!db.objectStoreNames.contains('filters')) {
            const store = db.createObjectStore('filters', { keyPath: 'key' });
            store.createIndex('context', 'context');
          }
        },
        blocked() {
          console.warn('IndexedDB blocked — feche outras abas com esta aplicação');
        },
        blocking() {
          console.warn('IndexedDB blocking — recarregue a página se persistir');
        }
      });
    } catch (error) {
      console.error('Error initializing IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Exclui uma database do IndexedDB com base no nome.
   * 
   * Deve ser chamado durante o logout para limpar dados do usuário.
   * 
   * @example
   * await this._indexedDB.closeOpenConnection();
   * await this._indexedDB.deleteDatabase();
  */
  public async deleteDatabase(): Promise<void> {
    return this._lock.acquire(async () => {
      // Fecha a conexão persistente local, se existir, antes de tentar excluir a DB
      await this._closeConnection();

      try {
        await deleteDB(this._dbName);
        this._isInitialized = false;
      } catch (err) {
        console.warn('Error deleting IndexedDB:', err);
        throw err;
      }
    });
  }

  /**
   * Fecha a conexão persistente (se existir) sem excluir a database.
   * Útil para cenários onde se precisa liberar a conexão antes de chamar `deleteDatabase()`.
   * 
   * @example
   * await this._indexedDB.closeOpenConnection();
  */
  public async closeOpenConnection(): Promise<void> {
    return this._lock.acquire(async () => {
      await this._closeConnection();
    });
  }

  /**
   * Executa o fechamento real da conexão.
   * @private
   */
  private async _closeConnection(): Promise<void> {
    if (this.request) {
      try {
        this.request.close();
      } catch (err) {
        console.warn('Error closing IndexedDB connection:', err);
      }

      this.request = undefined;
      this._isInitialized = false;
    }
  }

  /**
   * Valida se já existe um valor cadastrado na base com a chave-única que foi informada, 
   * se houver retorna ele, caso contrário cria um registro placeholder para poder atualizar depois.
   * 
   * @param key Valor da chave única
   * @param value (opcional) Valor placeholder caso não exista um valor previamente criado
   * 
   * @returns Estrutura encontrada no objectStore com a chave-única informada
  */
  public async validate(key: string, value?: ObjectToStore<any> | null): Promise<any> {
    // Valida se já existe registro no DB local
    this._restored = await this.get(key);
    
    if (!this._restored && value) {
      // Se não existir nada, inicializa um registro placeholder dentro do objectStore existente
      await this.add(value);
      return value?.payload;
    } else {
      // Se encontrar valor retorna apenas o payload com os dados que serão usados na tela
      return this._restored?.payload;
    }
  }

  // #endregion ==========> UTILS <==========

}
