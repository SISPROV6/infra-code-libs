import { Component, input, output, SimpleChanges, OnChanges } from '@angular/core';
import { RecordCombobox } from '../../models/combobox/record-combobox';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-dropdown-options, lib-dropdown-options',
    templateUrl: './dropdown-options.component.html',
    styleUrl: './dropdown-options.component.scss',
    standalone: true,
    imports: [FormsModule]
})
export class DropdownOptionsComponent implements OnChanges {
  options = input.required<RecordCombobox[]>();
  label = input.required();
  
  filterValue = input.required<string>();

  hideOptionId = input<string | null>();
  optionSelected = output<RecordCombobox>();
  
  filteredOptions: RecordCombobox[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hideOptionId'] || changes['filterValue']) {
      this.filterOptions();
    }
  }

  filterOptions() {
    this.filteredOptions = this.options().filter(option => 
      (!this.hideOptionId() || option.ID !== this.hideOptionId()) &&
      (this.filterValue() === '' || option.LABEL.toLowerCase().includes(this.filterValue().toLowerCase()))
    );
  }

  handleOptionClick(option: any): void {
    this.optionSelected.emit(option);
  }
}
