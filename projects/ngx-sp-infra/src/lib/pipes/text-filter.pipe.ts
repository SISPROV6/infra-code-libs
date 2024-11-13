import { Pipe, PipeTransform } from '@angular/core';
import { RecordCombobox } from '../models/combobox/record-combobox';

@Pipe({
  name: 'textFilter',
  pure: false
})
export class TextFilterPipe implements PipeTransform {
  transform(options: RecordCombobox[], search: string): any[] {
    if ((!options || options.length <= 0) || !search) return options;
    
    return options.filter(e => e.LABEL.toLocaleLowerCase().includes(search.toLocaleLowerCase()) 
      || e.ID.toLocaleString().toLocaleLowerCase().includes(search.toLocaleLowerCase())
      || (e.AdditionalStringProperty1 && e.AdditionalStringProperty1.toLocaleString().toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      || (e.AdditionalStringProperty2 && e.AdditionalStringProperty2.toLocaleString().toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    );
  }
}
