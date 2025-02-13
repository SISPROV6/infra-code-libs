import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatByType',
  pure: true
})
export class FormatByTypePipe implements PipeTransform {

  transform(value: string | string[] | number | Date | boolean): string {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}-\d{2}-\d{4}$|^\d{4}\/\d{2}\/\d{2}$/;

    if (value instanceof Date) {
      return this.formatDate(value);
    }
    else if (dateRegex.test(value as string)) {
      const parsedDate = this.parseDateWithoutTimezone(value as string);
      if (parsedDate) {
        return this.formatDate(parsedDate);
      }
    }

    if (typeof value === 'boolean') { return value ? 'Sim' : 'Não'; }

    if (Array.isArray(value) && value.length > 1) { return 'Múltiplos valores'; }

    if (typeof value === 'string' || typeof value === 'number') { return value.toString(); }

    // Caso não seja nenhum dos tipos conhecidos, retorna vazio ou uma mensagem padrão
    return value.toString();
  }


  /** Método auxiliar para formatar a data */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  /** Método para criar um Date sem fuso horário */
  private parseDateWithoutTimezone(dateString: string): Date | null {
    const parts = dateString.includes('-')
      ? dateString.split('-')
      : dateString.split('/');
    
    let year, month, day;

    if (parts[0].length === 4) {
      [year, month, day] = parts.map(Number); // Formato YYYY-MM-DD
    }
    else {
      [day, month, year] = parts.map(Number); // Formato DD-MM-YYYY
    }

    // Validação básica para evitar problemas com datas inválidas
    if (!year || !month || !day) { return null; }

    // Importante: O mês no objeto Date é zero-based
    return new Date(year, month - 1, day);
  }

}
