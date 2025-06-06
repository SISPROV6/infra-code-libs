import { Component, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-field-control-error, lib-control-error',
    templateUrl: './field-control-error.component.html',
    styleUrls: ['./field-control-error.component.css'],
    standalone: true,
    imports: [NgIf]
})
export class FieldControlErrorComponent implements OnInit {
  @Input() showError?: boolean;
  @Input() errorMessage?: string;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', '100%');
  }

}
