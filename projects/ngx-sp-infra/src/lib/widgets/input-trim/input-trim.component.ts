import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
    selector: 'lib-input-trim',
    templateUrl: './input-trim.component.html',
    styleUrls: ['./input-trim.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgClass]
})
export class InputTrimComponent implements OnInit {

  @Input() control: FormControl = new FormControl();
  @Input() placeholder: string = '';
  @Input() uppercase: boolean = false;

  ngOnInit(): void {
    if (this.control) {
      this.control.valueChanges.pipe(
        debounceTime(2000),
        distinctUntilChanged()
      ).subscribe(value => {
        this.control?.setValue(value.trim(), { emitEvent: false });
      });
    }
  }
}
