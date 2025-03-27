import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap/accordion';
import { NgIf } from '@angular/common';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

/**
 * Componente de acordion customizado, o seu conteúdo interno é informado pelo componente pai, podendo configurá-lo como necessário.
 * O componente em si é responsável apenas pelo comportamento de acordion, ou seja, abrir e fechar o conteúdo interno.
 * 
 * Propriedades:
 *    - name: string (default: 'Filtro avançado')
 *    - haveArrow: boolean (default: true)
 *    - haveMarginTop: boolean (default: false)
 *    - isOpen: boolean (default: false)
 */
@Component({
    selector: 'app-custom-acordion, lib-acordion',
    templateUrl: './custom-acordion.component.html',
    styleUrls: ['./custom-acordion.component.scss'],
    standalone: true,
    imports: [
        AccordionComponent,
        AccordionPanelComponent,
        NgIf,
        LibIconsComponent,
    ],
})
export class CustomAcordionComponent implements OnInit {

      // #region ==========> PROPERTIES <==========

      // #region PUBLIC
      @Input() public name: string = 'Filtro avançado';
      @Input() public haveArrow: boolean = true;
      @Input() public haveMarginTop: boolean = false;

      @Input() public isOpen?: boolean;
      @Input() public customClass?: string;

      @ViewChild('icon') iconRef?: ElementRef;

      protected iconDirection: 'baixo' | 'cima' = 'baixo';
      // #endregion PUBLIC

      // #endregion ==========> PROPERTIES <==========


      // #region ==========> INITIALIZATION <==========
      constructor() { }

      ngOnInit(): void {       
            //this.posicaoIcon = this.isOpen;
            
            if (this.isOpen) this.iconDirection = 'cima';
            else this.iconDirection = 'baixo';
      }
      // #endregion ==========> INITIALIZATION <==========


      // #region ==========> UTILS <==========
      public setIsOpen(){
            this.toogleIcon();
      }

      public toogleIcon(){
            if (this.iconDirection === 'baixo') this.iconDirection = 'cima';
            else this.iconDirection = 'baixo';
      }
      // #endregion ==========> UTILS <==========

}
