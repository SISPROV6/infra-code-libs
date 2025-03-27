import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { FormUtils } from '../../utils/form-utils';

@Component({
    selector: 'app-field-error-message, lib-error-message',
    templateUrl: './field-error-message.component.html',
    styleUrls: ['./field-error-message.component.css'],
    standalone: true
})
export class FieldErrorMessageComponent implements OnInit {
  @Input() public customMessage?: string;
  @Input() control?: AbstractControl | null;

  /** DEPRECIADO */
  @Input() label?: string;


  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef
  ) { }


  public get errorMessage() {
    for (const propertyName in this.control?.errors) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.control?.errors.hasOwnProperty(propertyName) &&
        (this.control?.dirty || this.control?.touched)) {
          return FormUtils.getErrorMessage(propertyName, this.control?.errors[propertyName], this.customMessage, this.label);
      }
    }

    return null;
  }
  

  ngOnInit(): void {
    this._renderer.setStyle(this._elementRef.nativeElement, 'width', '100%');
  }

}
