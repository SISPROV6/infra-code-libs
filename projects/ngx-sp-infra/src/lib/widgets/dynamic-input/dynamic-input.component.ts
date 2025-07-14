import { NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
    selector: 'app-dynamic-input, lib-dynamic-input',
    templateUrl: './dynamic-input.component.html',
    styleUrls: ['./dynamic-input.component.scss'],
    
    imports: [NgSwitch, NgSwitchCase, FormsModule, NgxMaskDirective, NgxCurrencyDirective]
})
export class DynamicInputComponent {

  constructor() { }


  // #region ==========> PROPERTIES <==========

  // #region PUBLIC
  @Input() public disableInput?: boolean;
  @Input() public typeInput?: string | 'date' | 'integer' | 'decimal' | 'phone' | 'text' | 'longtext' | 'time' | 'datetime' = "text";
  @Input() public showCharacterCounter?: boolean = true;

  @Input() public qtInteiros?: number;
  @Input() public qtDecimais?: number;
  @Input() public txConteudoCarac: string = '';

  @Output() private updateCoCarac: EventEmitter<string> = new EventEmitter<string>();

  public intMask: string = '';
  public decMask: string = '';

  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> UTILITIES <==========
  public sendEventUpdateCoCarac(): void {
    this.updateCoCarac.emit(this.txConteudoCarac);
  }
  // #endregion ==========> UTILITIES <==========


}
