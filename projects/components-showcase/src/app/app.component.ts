import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InfraModule } from "ngx-sp-infra";

type List = {
  coluna1: string;
  coluna2: string;
  coluna3: string;
  coluna4: string;
  coluna5: string;
  coluna6: string;
}

@Component({
  selector: 'app-root',
  imports: [ InfraModule, ReactiveFormsModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  control = new FormControl();
  items = [
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' },
    { value: 3, label: 'Three' }
  ];

  select(value: any) {
    console.log(value);
    
  }

}
