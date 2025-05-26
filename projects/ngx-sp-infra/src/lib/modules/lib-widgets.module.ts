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

import { AlertComponent } from '../message/alert/alert.component';
import { ConfirmModalComponent } from '../message/confirm-modal/confirm-modal.component';
import { ConfirmComponent } from '../message/confirm/confirm.component';
import { SaveComponent } from '../message/save/save.component';

import { AppliedFiltersComponent } from '../widgets/applied-filters/applied-filters.component';
import { InfraBreadcrumbItemComponent } from '../widgets/breadcrumb/infra-breadcrumb-item/infra-breadcrumb-item.component';
import { InfraBreadcrumbComponent } from '../widgets/breadcrumb/infra-breadcrumb/infra-breadcrumb.component';
import { BreadcrumbComponent } from '../widgets/breadcrumb/portalrh-breadcrumb/breadcrumb.component';
import { ComboboxMultipleChoiceComponent } from '../widgets/combobox-multiple-choice/combobox-multiple-choice.component';
import { ComboboxComponent } from '../widgets/combobox/combobox.component';
import { ContentContainerComponent } from '../widgets/content-container/content-container.component';
import { CustomAcordionComponent } from '../widgets/custom-acordion/custom-acordion.component';
import { DropdownOptionsComponent } from '../widgets/dropdown-options/dropdown-options.component';
import { DynamicInputComponent } from '../widgets/dynamic-input/dynamic-input.component';
import { FieldContadorMessageComponent } from '../widgets/field-contador-message/field-contador-message.component';
import { FieldControlErrorComponent } from '../widgets/field-control-error/field-control-error.component';
import { FieldErrorMessageComponent } from '../widgets/field-error-message/field-error-message.component';
import { GenericModalComponent } from '../widgets/generic-modal/generic-modal.component';
import { InputTrimComponent } from '../widgets/input-trim/input-trim.component';
import { LibComboboxComponent } from '../widgets/lib-combobox/lib-combobox.component';
import { LibHeaderComponent } from '../widgets/lib-header/lib-header.component';
import { LibIconsComponent } from '../widgets/lib-icons/lib-icons.component';
import { LibNavProdutosComponent } from '../widgets/lib-nav-produtos/lib-nav-produtos.component';
import { InnerListComponent } from '../widgets/lib-transfer-list/inner-list/inner-list.component';
import { LibTransferListComponent } from '../widgets/lib-transfer-list/lib-transfer-list.component';
import { LoadingButtonComponent } from '../widgets/loading-button/loading-button.component';
import { LoadingScreenComponent } from '../widgets/loading-screen/loading-screen.component';
import { LoadingComponent } from '../widgets/loading/loading.component';
import { NavProdutosComponent } from '../widgets/nav-produtos/nav-produtos.component';
import { OrderingComponent } from '../widgets/ordering/ordering.component';
import { PaginationComponent } from '../widgets/pagination/pagination.component';
import { PasswordPolicyComponent } from '../widgets/password-policy/password-policy.component';
import { SearchComboboxComponent } from '../widgets/search-combobox/search-combobox.component';
import { SearchFiltersComponent } from '../widgets/search-filters/search-filters.component';
import { SearchInputComponent } from '../widgets/search-input/search-input.component';
import { SideTabsGenericComponent } from '../widgets/side-tabs-generic/side-tabs-generic.component';
import { SimpleSearchComponent } from '../widgets/simple-search/simple-search.component';
import { LibSpinnerComponent } from '../widgets/spinner/spinner.component';
import { TableComponent } from '../widgets/table/table.component';
import { TreeComponent } from '../widgets/tree/tree.component';


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

    AlertComponent,
    ConfirmModalComponent,
    ConfirmComponent,
    SaveComponent,

    AppliedFiltersComponent,
    InfraBreadcrumbItemComponent,
    InfraBreadcrumbComponent,
    BreadcrumbComponent,
    ComboboxMultipleChoiceComponent,
    ComboboxComponent,
    ContentContainerComponent,
    CustomAcordionComponent,
    DropdownOptionsComponent,
    DynamicInputComponent,
    FieldContadorMessageComponent,
    FieldControlErrorComponent,
    FieldErrorMessageComponent,
    GenericModalComponent,
    InputTrimComponent,
    LibComboboxComponent,
    LibHeaderComponent,
    LibIconsComponent,
    LibNavProdutosComponent,
    InnerListComponent,
    LibTransferListComponent,
    LoadingButtonComponent,
    LoadingComponent,
    NavProdutosComponent,
    OrderingComponent,
    PaginationComponent,
    PasswordPolicyComponent,
    SearchComboboxComponent,
    SearchFiltersComponent,
    SearchInputComponent,
    SideTabsGenericComponent,
    SimpleSearchComponent,
    LibSpinnerComponent,
    TableComponent,
    TreeComponent,
    LoadingScreenComponent,
  ],
  exports: [
    AlertComponent,
    ConfirmModalComponent,
    ConfirmComponent,
    SaveComponent,
    
    AppliedFiltersComponent,
    InfraBreadcrumbItemComponent,
    InfraBreadcrumbComponent,
    BreadcrumbComponent,
    ComboboxMultipleChoiceComponent,
    ComboboxComponent,
    ContentContainerComponent,
    CustomAcordionComponent,
    DropdownOptionsComponent,
    DynamicInputComponent,
    FieldContadorMessageComponent,
    FieldControlErrorComponent,
    FieldErrorMessageComponent,
    GenericModalComponent,
    InputTrimComponent,
    LibComboboxComponent,
    LibHeaderComponent,
    LibIconsComponent,
    LibNavProdutosComponent,
    InnerListComponent,
    LibTransferListComponent,
    LoadingButtonComponent,
    LoadingComponent,
    NavProdutosComponent,
    OrderingComponent,
    PaginationComponent,
    PasswordPolicyComponent,
    SearchComboboxComponent,
    SearchFiltersComponent,
    SearchInputComponent,
    SideTabsGenericComponent,
    SimpleSearchComponent,
    LibSpinnerComponent,
    TableComponent,
    TreeComponent,
    LoadingScreenComponent,
  ]
})
export class LibWidgetsModule { }
