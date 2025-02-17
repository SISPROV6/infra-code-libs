/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { SelectionModel } from '../models/table/selection-model.model';

@Injectable({
  providedIn: 'any'
})
export class TableSelectionService {

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


  public initSelecao(list?: any[], idColumnName: string = "id"): Map<string | number, boolean> {
    if (list) {
      list.forEach(item => { this.selecaoMap.set(item[idColumnName], false) });
      return this.selecaoMap;
    }

    return new Map<string | number, boolean>();
  }
  

  public inverterSelecao(id: string | number) {
    const selecionado = this.selecaoMap.get(id) || false;
    this.selecaoMap.set(id, !selecionado);

    const todosSelecionados: boolean = Array.from(this.selecaoMap.values()).every(item => item);

    if (todosSelecionados) { this.selecaoGeral = true; }
    else { this.selecaoGeral = false; }
  }

  public definirSelecaoTotal(list?: any[], selecao?: boolean, idColumnName: string = "id") {
    if (list) {
      list.forEach(item => { this.selecaoMap.set(item[idColumnName], selecao ?? false) });
    }
  }
  // #endregion ==========> UTILS <==========

}
