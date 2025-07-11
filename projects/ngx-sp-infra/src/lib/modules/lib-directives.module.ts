import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgxPaginationModule } from 'ngx-pagination';

import { A11yClickDirective } from '../directives/a11y-click.directive';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import { CopyClipboardDirective } from '../directives/copy-clipboard.directive';
import { DisableControlDirective } from '../directives/disable-control.directive';
import { HighlightDirective } from '../directives/highlight.directive';
import { LoadingBtnDirective } from '../directives/loading-btn.directive';
import { RequiredDirective } from '../directives/required.directive';
import { TextTruncateDirective } from '../directives/text-truncate.directive';


@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule,
    FormsModule,
    NgxCurrencyDirective,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxPaginationModule,
    ReactiveFormsModule,
    RouterModule,
  
    ClickOutsideDirective,
    CopyClipboardDirective,
    DisableControlDirective,
    HighlightDirective,
    LoadingBtnDirective,
    RequiredDirective,
    TextTruncateDirective,

    A11yClickDirective,
  ],
  exports: [
    ClickOutsideDirective,
    CopyClipboardDirective,
    DisableControlDirective,
    HighlightDirective,
    LoadingBtnDirective,
    RequiredDirective,
    TextTruncateDirective,

    A11yClickDirective,
  ]
})
export class LibDirectivesModule { }
