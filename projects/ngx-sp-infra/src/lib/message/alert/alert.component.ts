/* eslint-disable @angular-eslint/component-selector */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { alertTypes } from '../message-enum';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    standalone: true
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() message?: string;
  @Input() type?: alertTypes;
  @Input() id: number = 0;
  
  constructor(
    public _bsModalRef: BsModalRef,
    public _bsModalService: BsModalService,

  ) { }
  
  ngOnInit(): void {
    const elSpan = document.createElement('span');

    elSpan.classList.add('xoverflow')

    elSpan.innerHTML = this.message ?? "";

    // Caso a mensagem seja muito grande, é quebrada para a próxima linha
    elSpan.style.wordBreak = "break-word";

    const elDivMessage = document.getElementById( "divMessage" );
    
    elDivMessage?.appendChild(elSpan);
  }

  ngOnDestroy(): void {
    this._bsModalRef.hide();
  
    this._bsModalService.hide();
    this._bsModalService.removeBackdrop();
  }

  public closeAlert(): void {
    this.message = '';
    
    this._bsModalRef.hide();
    
    // this._bsModalService.hide();
    // this._bsModalService.removeBackdrop();
  }

}
