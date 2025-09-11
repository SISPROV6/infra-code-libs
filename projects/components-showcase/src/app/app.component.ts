import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InfraModule } from '../../../ngx-sp-infra/src/public-api';

@Component({
  selector: 'app-root',
  imports: [
    InfraModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  control = new FormControl<any>([
    { name: 1, surname: 'Erick Carvalho Paulette de Oliveira' },
    { name: 2, surname: 'Solturne' },
    { name: 3, surname: 'Mare Itami' },
  ], [ Validators.required ]);

  filteredItems: { name: string | number, surname: string }[] = [];
  items = [
    { name: 1, surname: 'Erick Carvalho Paulette de Oliveira' },
    { name: 2, surname: 'Solturne' },
    { name: 3, surname: 'Mare Itami' },
    { name: 4, surname: 'Wylow Zeppelli' },
    { name: 5, surname: 'Sol' },
    { name: 6, surname: 'Saturno' },
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

  ngOnInit(): void {
    this.filteredItems = this.items;

    setTimeout(() => {
      console.log("this.control.invalid", this.control.invalid);
    }, 5000);
  }

  public disableForm5(): void {
    this.disabledInputs.set("formCombobox5", true);
    this.formCombobox5.controls["PESSOACONTRAPARTEID"].disable();
  }
  public enableForm5(): void {
    this.disabledInputs.set("formCombobox5", false);
    this.formCombobox5.controls["PESSOACONTRAPARTEID"].enable();
  }

  log(value: any) {
    // console.log(value);
  }

  filter(search: string | null) {
    this.log(this.filteredItems);

    this.filteredItems = this.items.filter(e => {
      return e.surname.toLowerCase().includes(search ? search.toLowerCase() : "")
    });

    this.log(search);
    this.log(this.filteredItems);
  }

}
