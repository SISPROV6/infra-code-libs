/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { RecordCombobox } from '../models/combobox/record-combobox';

@Pipe({
  name: 'textFilter',
  pure: false,
  standalone: true
})
export class TextFilterPipe implements PipeTransform {
  transform(options: RecordCombobox[], search: string): any[] {
    if ((!options || options.length <= 0) || !search) return options;

    const normalizedSearch = this.normalizeText(search);

    return options.filter(e => this.normalizeText(e.LABEL).includes(normalizedSearch.toLocaleLowerCase())
      || (this.normalizeText(e.AdditionalStringProperty1) && this.normalizeText(e.AdditionalStringProperty1).includes(normalizedSearch.toLocaleLowerCase()))
      || (this.normalizeText(e.AdditionalStringProperty2) && this.normalizeText(e.AdditionalStringProperty2).includes(normalizedSearch.toLocaleLowerCase()))
    );
  }

  public normalizeText(texto: string | undefined): string {
    if (!texto || texto == undefined) return "";

    return texto
      .normalize('NFD')
      // regex pra retirar acentos
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
