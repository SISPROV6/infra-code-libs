import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgxCurrencyDirective } from 'ngx-currency';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-dynamic-input, lib-dynamic-input',
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxCurrencyDirective
  ],
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  @ContentChild("leftAddon", { read: TemplateRef, static: false }) leftAddon?: TemplateRef<any>;
  @ContentChild("rightAddon", { read: TemplateRef, static: false }) rightAddon?: TemplateRef<any>;

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
