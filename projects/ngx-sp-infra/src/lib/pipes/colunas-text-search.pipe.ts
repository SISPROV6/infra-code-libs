import { Pipe, PipeTransform } from '@angular/core';
import { TableHeaderStructure } from '../models/table/header-structure.model';

@Pipe({
  name: 'colunasTextSearch',
  pure: false,
  standalone: true
})
export class ColunasTextSearchPipe implements PipeTransform {

  transform(colunas: TableHeaderStructure[], search: string): TableHeaderStructure[] {
    if ((!colunas || colunas.length <= 0) || !search) return colunas;

    return colunas.filter(e => e.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  }

}
