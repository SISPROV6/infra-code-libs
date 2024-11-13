import { Directive, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective implements OnInit {

  @Input() disableControl?: boolean;

  constructor(private ngControl: NgControl) {}

  ngOnInit() {
    if (this.disableControl) {
      this.ngControl.control?.disable();
    } else {
      this.ngControl.control?.enable();
    }
  }
}
