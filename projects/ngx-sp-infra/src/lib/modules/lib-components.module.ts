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

@NgModule({
  declarations: [
    // FooterComponent,
    // PageNotAuthorizedComponent,
  ],
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
    RouterModule
  ],
  exports: [
    // FooterComponent,
    // PageNotAuthorizedComponent,
  ]
})
export class LibComponentsModule { }
