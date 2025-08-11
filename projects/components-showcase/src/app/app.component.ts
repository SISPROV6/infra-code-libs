import { Component } from '@angular/core';
import { InfraModule } from "ngx-sp-infra";
import { TableHeaderStructure } from '../../../ngx-sp-infra/src/public-api';

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
  imports: [ InfraModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  public headers: TableHeaderStructure[] = [
    { name: 'Coluna 1', widthClass: 'col-1' },
    { name: 'Coluna 2', widthClass: 'col-3' },
    { name: 'Coluna 3', widthClass: 'col-2' },
    { name: 'Coluna 4', widthClass: 'col-2' },
    { name: 'Coluna 5', widthClass: 'col-2' },
    { name: '', widthClass: 'col-1' },
  ];

  public list: List[] = [
    { coluna1: 'string', coluna2: 'string', coluna3: 'string', coluna4: 'string', coluna5: 'string', coluna6: 'string', },
    { coluna1: 'stringstringstringstringstringstringstringstringstringstring', coluna2: 'string', coluna3: 'string', coluna4: 'string', coluna5: 'string', coluna6: 'string', },
    { coluna1: 'string', coluna2: 'string', coluna3: 'string', coluna4: 'strstringstringstringstringstringstringstringstringstringstringstringstringing', coluna5: 'string', coluna6: 'string', },
    { coluna1: 'string', coluna2: 'string', coluna3: 'string', coluna4: 'string', coluna5: 'strinstringstringstringstringstringstringg', coluna6: 'string', },
    { coluna1: 'string', coluna2: 'stristringstringstringstringstringstringng', coluna3: 'string', coluna4: 'string', coluna5: 'string', coluna6: 'string', },
    { coluna1: 'stringstringstringstringstring', coluna2: 'string', coluna3: 'string', coluna4: 'string', coluna5: 'string', coluna6: 'string', },
    { coluna1: 'string', coluna2: 'string', coluna3: 'string', coluna4: 'string', coluna5: 'string', coluna6: 'string', },
    { coluna1: 'string', coluna2: 'stristringstringstringstringstringstringstringng', coluna3: 'string', coluna4: 'string', coluna5: 'string', coluna6: 'string', },
    { coluna1: 'string', coluna2: 'string', coluna3: 'strstringstringstringstringstringing', coluna4: 'string', coluna5: 'string', coluna6: 'string', },
  ];

}
