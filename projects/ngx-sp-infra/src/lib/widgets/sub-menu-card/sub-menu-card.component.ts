import { Component, Input } from '@angular/core';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

export class NavSubmenuCards {
  titulo: string = '';
  icon: string = '';
  descricao: string = '';
  urlPath: string = '';
};

@Component({
  selector: 'sub-menu-card',
  imports: [LibIconsComponent],
  template: `
    <div class="max-card-menu row">
      @for(card of subMenuCards; track $index) {
        <a href="{{ card.urlPath }}" class="card-link col-4">
          <div class="card">
            <div class="card-icon">
              <div class="card-icon2">
                <lib-icon  
                  class="bold" 
                  iconName="{{ card.icon ? card.icon : 'engrenagem'}}" 
                  iconColor="blue" 
                  [iconFill]="true" 
                  [iconSize]="35"
                ></lib-icon>
              </div>
            </div>
            <h3 class="card-title">{{ card.titulo }}</h3>
            <p class="card-text" title="{{ card.descricao }}">
              {{ card.descricao }}
            </p>
          </div>
        </a>
      }
    </div>
  `,
  styleUrl: './sub-menu-card.component.scss',
  standalone: true
})
export class SubMenuCardComponent {

@Input() subMenuCards: NavSubmenuCards[] = [];

}
