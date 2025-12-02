import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm',
  template: `
    <div class="modal-content ">
      <div class="modal-header">
        <h5 class="modal-title">{{ title }}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div id="divMessage"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" (click)="confirm()">{{ okText }}</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" (click)="closeConfirm()">{{ cancelText }}</button>
      </div>
    </div>
  `,
  styles: ``,
})
export class ConfirmComponent implements OnInit {
  
  @Input() title?: string;
  @Input() message?: string;
  @Input() cancelText: string = 'Cancelar';
  @Input() okText: string = 'Sim';
  @Input() okButton!: Function;
  @Input() parametroOkButton?: boolean;
  @Output() clickButton = new EventEmitter<'confirmado' | 'cancelado'>();

  public confirmResult!: Subject<'confirmado' | 'cancelado'>;


  constructor(private _bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.confirmResult = new Subject();
  
    const elSpan = document.createElement('span');
    elSpan.classList.add('xoverflow')
    elSpan.innerHTML = this.message ?? "";

    const elDivMessage = document.getElementById( "divMessage" );
    elDivMessage?.appendChild(elSpan);
  }


  confirm() {
    this.confirmAndClose('confirmado');
  }

  closeConfirm() {
    this.confirmAndClose('cancelado');
  }

  private confirmAndClose(value: 'confirmado' | 'cancelado') {
    this._bsModalRef.hide();
    this.confirmResult.next( value )

    this.clickButton.emit(value);
  }

}
