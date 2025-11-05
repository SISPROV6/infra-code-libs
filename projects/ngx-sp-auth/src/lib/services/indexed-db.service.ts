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


@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _restored?: ObjectToStore<any>;
  private _dbName: string = "Sp_Filtros_";
  // #endregion PRIVATE

  protected database?: IDBDatabase;
  protected request?: IDBPDatabase<unknown>;

  // #endregion ==========> PROPERTIES <==========


  constructor( private _customEnvironment: LibCustomEnvironmentService ) {
    if (!window.indexedDB) {
      alert("Seu navegador não suporta uma versão estável do IndexedDB. Salvamento de filtros em sessão não estará disponível.");
    }

    this._dbName = `Sp_${ _customEnvironment.product }_Filtros`;
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
    const db = await openDB(this._dbName, 1);
    await db.add('filters', value);
  }

  // #endregion ADD

  // #region GET


  /**
   * Busca um valor na base dentro de um objectStore.
   * 
   * @param storeName Nome do objectStore
   * @param key Valor da chave única
   * @returns Promise<> com o valor encontrado ou undefined se não encontrar
   */
  async get(key: string): Promise<ObjectToStore<any>> {
    const db = await openDB(this._dbName, 1);
    return await db.get('filters', key);
  }

  // #endregion GET

  // #region UPDATE

  /**
   * Atualiza o valor de um registro dentro de um objectStore.
   * 
   * @param value Valor atualizado
   */
  async update(value: ObjectToStore<any>): Promise<void> {
    const db = await openDB(this._dbName, 1);
    await db.put('filters', value)
  }

  // #endregion UPDATE

  // #region DELETE

  /**
   * Exclui um registro na base dentro de um objectStore.
   * 
   * @param key Valor da chave única
   */
  async delete(key: string): Promise<void> {
    const db = await openDB(this._dbName, 1);
    await db.delete('filters', key);
  }

  // #endregion DELETE

  // #endregion ==========> ACTIONS <==========


  // #region ==========> UTILS <==========

  /**
   * Inicializa as configurações iniciais do IndexedDB e já cria o objectStore que será utilizado caso não exista.
   * 
   * O object store que será criado terá sua chave inline na propriedade `key` e o índice será a propriedade `context`, portanto todos os valores que forem inseridos **DEVEM** ser um objeto com pelo menos a propriedade `key` e `context`.
   * Deve ser chamado no constructor do seu componente para garantir inicialização correta pelo componente
   * 
   * @param dbName Nome da base de dados que será usada
  */
  public async initializeDatabase(dbName: string = this._dbName) {
    this.request = await openDB(dbName, 1, {
      upgrade (db) {

        // Criar objectStore se não houver um mesmo com este nome
        if (!db.objectStoreNames.contains('filters')) {
          const store = db.createObjectStore('filters', { keyPath: 'key' });
          store.createIndex('context', 'context');
        }

      },
      blocked() {
        // notify user / log: another tab has old version open
        console.warn('IndexedDB blocked — feche outras abas');
      },
      blocking() {
        // this instance is blocking a future version request
        console.warn('IndexedDB blocking — considere fechar esta conexão');
      }
    })
  }

  /**
   * Exclui uma database do IndexedDB com base no nome.
   * 
   * @param name Nome da database
  */
  public async deleteDatabase(name: string): Promise<void> {
    return await deleteDB(name);
  }



  /**
   * Valida se já existe um valor cadastrado na base com a chave-única que foi informada, se houver retorna ele, caso contrário cria um registro placeholder para poder atualizar depois.
   * 
   * @param key Valor da chave única
   * @param value (opcional) Valor placeholder caso não exista um valor previamente criado
   * 
   * @returns Estrutura encontrada no objectStore com a chave-única informada
  */
  public async validate(key: string, value?: ObjectToStore<any> | null) {

    // Valida se já existe registro no DB local
		this._restored = await this.get(key);
		
		if (!this._restored && value) {
			// Se não existir nada, inicializa um registro placeholder dentro do objectStore existente
			await this.add(value)
		}
		else {
      // Se encontrar valor retorna apenas o payload com os dados que serão usados na tela
      return this._restored?.payload;
		}
  }

  // #endregion ==========> UTILS <==========

}
