/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { SelectionModel } from '../models/table/selection-model.model';

@Injectable({
  providedIn: 'any'
})
export class TableSelectionService {
  // ...existing code...

  /** Verifica se um item está selecionado usando múltiplas colunas como chave composta. */
  public isSelecionadoPorItem(item: any, idColumnNames: string[] = ["id"]): boolean {
    const key = this.makeCompositeKeyFromItem(item, idColumnNames);
    return this.selecaoMap.get(key) === true;
  }

  // #region ==========> PROPERTIES <==========
  
  // #region PRIVATE
  private _selecaoGeral: boolean = false;
  // #endregion PRIVATE

  // #region PUBLIC
  public selecaoMap: Map<string | number, boolean> = new Map<string | number, boolean>();

  public get selecaoGeral(): boolean { return this._selecaoGeral; }
  public set selecaoGeral(value: boolean) { this._selecaoGeral = value; }
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor() { }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> UTILS <==========

  /** Retorna os registros selecionados dentro de um array do tipo SelectionModel[] ou um array tipo any[]
   * @param returnObj Informa se o retorno será uma lista de objetos (SelectionModel[]) ou um array de arrays */
  public getOnlySelecionados(returnObj: boolean = false): SelectionModel[] | any[] {
    if (returnObj) {
      // Definição da lista
      const list = Array.from(this.selecaoMap).filter(item => item[1] === true);
      
      // Construção do retorno
      return list.map(item => {
        return {
          ID: item[0],
          SELECTED: item[1]
        };
      });
    }
    
    return Array.from(this.selecaoMap).filter(item => item[1] === true);
  }

  public quantidadeSelecionados(): number {
    return Array.from(this.selecaoMap).filter(item => item[1] === true).length;
  }


  // #region Inicialização da seleção

  /** Inicializa a seleção usando uma coluna como chave de identificação.
   * @param list lista de objetos
   * @param columns nome da coluna que será usada de identificação
  */
  initSelecao(list: any[], columns: string): Map<string | number, boolean>;

  /** Inicializa a seleção usando múltiplas colunas como chave composta.
   * @param list lista de objetos
   * @param columns array de nomes de colunas (pode usar paths como 'pessoa.id')
  */
  initSelecao(list: any[], columns: string[]): Map<string | number, boolean>;

  initSelecao(list: any[], columns: string | string[]): unknown {
    if (Array.isArray(columns)) {
      if (list) {
        list.forEach(item => {
          const key = this.makeCompositeKeyFromItem(item, columns);
          this.selecaoMap.set(key, false);
        });
        return this.selecaoMap;
      }

      return new Map<string | number, boolean>();
    }
    
    else if (typeof columns === 'string') {
      if (list) {
        list.forEach(item => { this.selecaoMap.set(item[columns], false) });
        this.selecaoGeral = false;
        return this.selecaoMap;
      }

      return new Map<string | number, boolean>();
    }
    
    throw new Error("Nenhuma sobrecarga aceita os argumentos informados para o método: 'initSelecao'.");
  }

  // #endregion Inicialização da seleção
  
  // #region Inverter seleção

  /** Inverte a seleção com base em um valor de identificação dos itens rastreados na seleção. */
  inverterSelecao(id?: string | number, item?: any, columns?: string[]): void;

  /** Inverte a seleção com base em um item completo, usando colunas para gerar a chave composta. */
  inverterSelecao(id?: null, item?: any, columns?: string[]): void;

  public inverterSelecao(id?: string | number | null, item?: any, columns?: string[]): void {
    if (!!id) {
      const selecionado = this.selecaoMap.get(id) || false;
      this.selecaoMap.set(id, !selecionado);
  
      const todosSelecionados: boolean = Array.from(this.selecaoMap.values()).every(item => item);
  
      if (todosSelecionados) { this.selecaoGeral = true; }
      else { this.selecaoGeral = false; }

      return;
    }

    else if (!!item && !!columns) {
      const key = this.makeCompositeKeyFromItem(item, columns);
      const selecionado = this.selecaoMap.get(key) || false;
      this.selecaoMap.set(key, !selecionado);

      const todosSelecionados: boolean = Array.from(this.selecaoMap.values()).every(v => v);
      this.selecaoGeral = todosSelecionados;

      return;
    }

    throw new Error("Nenhuma sobrecarga aceita os argumentos informados para o método: 'inverterSelecao'.");
  }

  // #endregion Inverter seleção

  // #region Definir seleção total

  /** Define seleção total usando uma coluna de identificação. */
  definirSelecaoTotal(list?: any[], selecao?: boolean, columns?: string): void;

  /** Define seleção total usando colunas compostas como chave. */
  definirSelecaoTotal(list?: any[], selecao?: boolean, columns?: string[]): void;
  
  public definirSelecaoTotal(list?: any[], selecao?: boolean, columns?: string | string[]) {
    if (typeof columns === 'string') {
      if (list) {
        list.forEach(item => { this.selecaoMap.set(item[columns], selecao ?? false) });
      }

      this.selecaoGeral = selecao ?? false;
      return;
    }

    else if (Array.isArray(columns)) {
      if (list) {
        list.forEach(item => {
          const key = this.makeCompositeKeyFromItem(item, columns);
          this.selecaoMap.set(key, selecao ?? false);
        });
      }

      this.selecaoGeral = selecao ?? false;
      return;
    }

    throw new Error("Nenhuma sobrecarga aceita os argumentos informados para o método: 'definirSelecaoTotal'.");
  }

  // #endregion Definir seleção total


  // #region Composite Key Support

  /**
   * Gera uma chave estável a partir de um objeto e de uma lista de colunas.
   * A chave é criada concatenando os valores das colunas com um separador estável.
  */
  private makeCompositeKeyFromItem(item: any, columns: string[]): string {
    const values = columns.map(col => {
      // suporta caminhos tipo 'a.b.c'
      const parts = col.split('.');
      const value = parts.reduce((acc, p) => acc ? acc[p] : undefined, item);
      return value === undefined || value === null ? '' : String(value);
    });

    // use JSON.stringify para evitar colisões simples e manter previsibilidade
    return JSON.stringify(values);
  }

  // #endregion Composite Key Support

  // #endregion ==========> UTILS <==========

}
