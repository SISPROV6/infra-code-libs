import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatByType'
})
export class FormatByTypePipe implements PipeTransform {

  transform(value: string | string[] | number | Date | boolean): string {
    if (typeof value === 'string' || typeof value === 'number') { return value.toString(); }

    if (value instanceof Date) {
      const dataObj = new Date(value);
      return dataObj.toLocaleString();
    }

    if (typeof value === 'boolean') { return value ? 'Sim' : 'Não'; }

    if (Array.isArray(value) && value.length > 1) { return 'Múltiplos valores'; }

    // Caso não seja nenhum dos tipos conhecidos, retorna vazio ou uma mensagem padrão
    return value.toString();
  }

}
