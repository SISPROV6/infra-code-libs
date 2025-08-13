import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InfraModule } from '../../../ngx-sp-infra/src/public-api';



@Component({
  selector: 'app-root',
  imports: [ InfraModule, ReactiveFormsModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  control = new FormControl();
  items = [
    { name: 1, surname: 'One' },
    { name: 2, surname: 'Two' },
    { name: 3, surname: 'Three' },
    { name: 4, surname: 'Four' },
    { name: 5, surname: 'Five' },
    { name: 6, surname: 'Six' },
    { name: 7, surname: 'Seven' },
    { name: 8, surname: 'Eight' },
    { name: 9, surname: 'Nine' },
    { name: 10, surname: 'Ten' },
    { name: 11, surname: 'Eleven' },
    { name: 12, surname: 'Twelve' },
    { name: 13, surname: 'Thirteen' },
    { name: 14, surname: 'Fourteen' },
    { name: 15, surname: 'Fifteen' },
  ];
  combobox = [
    { ID: 1, LABEL: 'One' },
    { ID: 2, LABEL: 'Two' },
    { ID: 3, LABEL: 'Three' },
    { ID: 4, LABEL: 'Four' },
    { ID: 5, LABEL: 'Five' },
    { ID: 6, LABEL: 'Six' },
    { ID: 7, LABEL: 'Seven' },
    { ID: 8, LABEL: 'Eight' },
    { ID: 9, LABEL: 'Nine' },
    { ID: 10, LABEL: 'Ten' },
    { ID: 11, LABEL: 'Eleven' },
    { ID: 12, LABEL: 'Twelve' },
    { ID: 13, LABEL: 'Thirteen' },
    { ID: 14, LABEL: 'Fourteen' },
    { ID: 15, LABEL: 'Fifteen' },
  ];

  public disabledInputs: Map<string, boolean> = new Map<string, boolean>();

  public formCombobox5: FormGroup = new FormGroup({
    // ...outros controls
    PESSOAPARTEID: new FormControl<string | null>(null),
    PESSOACONTRAPARTEID: new FormControl<string | null>(null)
  });

  public disableForm5(): void {
  this.disabledInputs.set("formCombobox5", true);
  this.formCombobox5.controls["PESSOACONTRAPARTEID"].disable();
  
  }
  public enableForm5(): void {
    this.disabledInputs.set("formCombobox5", false);
    this.formCombobox5.controls["PESSOACONTRAPARTEID"].enable();
  }

  select(value: any) {
    console.log(value);
  }

}
