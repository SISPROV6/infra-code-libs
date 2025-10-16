import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TelaItem } from '../sub-menu.component';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: true
})
export class ListComponent {

  @Input() telasItem  : TelaItem[] = [];
  @Input() hostName:string = '';

  @Output() onTelaSelecionada: EventEmitter<string | null> = new EventEmitter<string | null>();

  public getExternalUrl = (url: string) => { return `${ this.hostName }/${ url }`; }

}
