import { Component, Input, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-save',
    templateUrl: './save.component.html',
    styleUrls: ['./save.component.scss'],
    
    imports: [FormsModule, NgFor],
})
export class SaveComponent implements OnInit {
  @Input() title?: string;
  @Input() message?: string;
  @Input() cancelText: string = 'Cancelar';
  @Input() okText: string = 'Sim';
  @Input() okButton!: Function;
  @Input() fields?: string[];

  confirmResult!: Subject<boolean>;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.confirmResult = new Subject();
  }

  confirm() {
  

    this.okButton({Id: 15});
    this.confirmAndClose(true);
  }

  closeConfirm() {
    this.confirmAndClose(false);
  }

  private confirmAndClose(value: boolean) {
    if (this.confirmResult) {
      this.confirmResult.next(value);
    }

    this.bsModalRef.hide();
  }
}
