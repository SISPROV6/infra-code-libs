import { AbstractControl, FormControl } from '@angular/forms';
import { Component, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';

import { FormUtils } from '../../utils/form-utils';

@Component({
  selector: 'app-field-error-message',
  templateUrl: './field-error-message.component.html',
  styleUrls: ['./field-error-message.component.css']
})
export class FieldErrorMessageComponent implements OnInit {
  @Input('customMessage') public customErrorMessage?: string;
  @Input() control?: AbstractControl | null;
  @Input() label?: string;


  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef
  ) { }


  public get errorMessage() {
    for (const propertyName in this.control?.errors) {
      if (this.control?.errors.hasOwnProperty(propertyName) &&
        (this.control?.dirty || this.control?.touched)) {
          return FormUtils.getErrorMessage(propertyName, this.control?.errors[propertyName], this.customErrorMessage, this.label);
      }
    }

    return null;
  }
  

  ngOnInit(): void {
    this._renderer.setStyle(this._elementRef.nativeElement, 'width', '100%');
  }

}
