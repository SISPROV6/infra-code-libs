import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgxPaginationModule } from 'ngx-pagination';


import { CpfCnpjPipe } from '../pipes/cpf-cnpj.pipe';
import { CurrencyPipe } from '../pipes/currency.pipe';
import { DecimalCommaPipe } from '../pipes/decimal-comma.pipe';
import { FilterMultipleChoicePipe } from '../pipes/filter-multiple-choice.pipe';
import { FormatByTypePipe } from '../pipes/format-by-type.pipe';
import { OrderSortPipe } from '../pipes/order-sort.pipe';
import { PhoneFormatPipe } from '../pipes/phone-format.pipe';
import { TextFilterPipe } from '../pipes/text-filter.pipe';
import { ToUrlPipe } from '../pipes/to-url.pipe';
import { FilterByPipe } from '../widgets/combobox/pipes/filter-by.pipe';
import { LimitToPipe } from '../widgets/combobox/pipes/limit-to.pipe';
import { SearchTreePipe } from '../widgets/tree/pipes/search-tree.pipe';


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

    ToUrlPipe,
    CurrencyPipe,
    CpfCnpjPipe,
    FilterByPipe,
    LimitToPipe,
    SearchTreePipe,
    TextFilterPipe,
    DecimalCommaPipe,
    FilterMultipleChoicePipe,
    OrderSortPipe,
    PhoneFormatPipe,
    TitleCasePipe,
    FormatByTypePipe,
  ],
  exports: [
    ToUrlPipe,
    CurrencyPipe,
    CpfCnpjPipe,
    FilterByPipe,
    LimitToPipe,
    SearchTreePipe,
    TextFilterPipe,
    DecimalCommaPipe,
    FilterMultipleChoicePipe,
    OrderSortPipe,
    PhoneFormatPipe,
    TitleCasePipe,
    FormatByTypePipe,
  ]
})
export class LibPipesModule { }
