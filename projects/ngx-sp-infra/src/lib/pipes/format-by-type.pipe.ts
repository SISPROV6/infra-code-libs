import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatByType'
})
export class FormatByTypePipe implements PipeTransform {

  transform(value: string | string[] | number | Date | boolean): string {
    if (typeof value === 'string' || typeof value === 'number') { return value.toString(); }

    if (value instanceof Date) {
      const dataObj = new Date(value); // Cria um objeto Date a partir da string
      const dia = dataObj.getDate().toString().padStart(2, '0'); // Obtém o dia e adiciona zero à esquerda se necessário
      const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês (lembrando que o mês começa de 0)
      const ano = dataObj.getFullYear(); // Obtém o ano
      
      return `${dia}/${mes}/${ano}`; // Retorna no formato desejado
      
      // Usando Intl.DateTimeFormat para formatar datas
      // return new Intl.DateTimeFormat('pt-BR', {
      //   day: '2-digit',
      //   month: '2-digit',
      //   year: 'numeric',
      // }).format(value);
    }

    if (typeof value === 'boolean') { return value ? 'Sim' : 'Não'; }

    if (Array.isArray(value) && value.length > 1) { return 'Múltiplos valores'; }

    // Caso não seja nenhum dos tipos conhecidos, retorna vazio ou uma mensagem padrão
    return value.toString();
  }

}
