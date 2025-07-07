import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

@Component({
    selector: 'app-ordering, lib-ordering',
    imports: [ LibIconsComponent, TooltipModule ],
    template: `
      @switch (sortDirection) {
        @case ('asc') {
          <lib-icon tooltip="Crescente" class="glb-cursor-pointer"
            iconName="seta-cima" iconColor="blue"
            [iconSize]="20" (click)="emitSort()" />
        }
        @case ('desc') {
          <lib-icon tooltip="Decrescente" class="glb-cursor-pointer"
          iconName="seta-baixo" iconColor="blue"
          [iconSize]="20" (click)="emitSort()" />
        }
        @default {
          <lib-icon tooltip="Sem ordenação aplicada" class="glb-cursor-pointer"
          iconName="cimabaixo" iconColor="gray"
          [iconSize]="20" (click)="emitSort()" />
        }
      }
    `,
    styles: ``
})
export class OrderingComponent implements OnInit {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  // [...]
  // #endregion PRIVATE

  // #region PUBLIC
  
  /** Direção atual da ordenação ('asc', 'desc' ou vazio) */
  @Input() sortDirection: string = '';

  /** Atributos de ordenação */
  @Input() sortAttributes: string | string[] = [];

  
  /** Evento emitido quando a direção de ordenação é alterada */
  @Output() sortDirectionChange = new EventEmitter<string>();

  /** Evento emitido quando ocorre uma mudança na ordenação */
  @Output() sortChange = new EventEmitter<{ direction: string, column: string | string[] }>();

  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor() {}

  ngOnInit(): void {
    this.sortDirection = '';
  }


  // #region ==========> UTILS <==========
  
  /** Chamada quando o botão de ordenação é clicado */
  public emitSort(): void {
    // Inverte a direção de ordenação atual
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    // Emite o evento com a nova direção de ordenação
    this.sortDirectionChange.emit(this.sortDirection);

    // Emite o evento de mudança na ordenação com a direção e os atributos de ordenação
    this.sortChange.emit({ direction: this.sortDirection, column: this.sortAttributes });
  }

  // #endregion ==========> UTILS <==========

}
