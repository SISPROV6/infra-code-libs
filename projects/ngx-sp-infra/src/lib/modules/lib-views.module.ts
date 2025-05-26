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

import { FooterComponent } from '../components/footer/footer.component';
import { LibConfigSenhaComponent } from '../components/lib-config-senha/lib-config-senha.component';
import { PageNotAuthorizedComponent } from '../components/page-not-authorized/page-not-authorized.component';


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

    FooterComponent,
    LibConfigSenhaComponent,
    PageNotAuthorizedComponent,
  ],
  exports: [
    FooterComponent,
    LibConfigSenhaComponent,
    PageNotAuthorizedComponent,
  ]
})
export class LibViewsModule { }
