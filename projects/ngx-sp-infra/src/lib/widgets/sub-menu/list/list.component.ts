import { Component, Input } from '@angular/core';
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

}
