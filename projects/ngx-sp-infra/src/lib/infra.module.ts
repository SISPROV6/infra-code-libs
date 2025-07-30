import { LibAuthenticationConfigComponent } from './components/lib-authentication-config/components/lib-authentication-config.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingScreenComponent } from './widgets/loading-screen/loading-screen.component';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AlertComponent } from './message/alert/alert.component';
import { ConfirmModalComponent } from './message/confirm-modal/confirm-modal.component';
import { ConfirmComponent } from './message/confirm/confirm.component';
import { SaveComponent } from './message/save/save.component';
import { CpfCnpjPipe } from './pipes/cpf-cnpj.pipe';
import { ToUrlPipe } from './pipes/to-url.pipe';
import { AuditoriaButtonComponent } from './widgets/auditoria-button/auditoria-button.component';
import { InfraBreadcrumbItemComponent } from './widgets/breadcrumb/infra-breadcrumb-item/infra-breadcrumb-item.component';
import { InfraBreadcrumbComponent } from './widgets/breadcrumb/infra-breadcrumb/infra-breadcrumb.component';
import { BreadcrumbComponent } from './widgets/breadcrumb/portalrh-breadcrumb/breadcrumb.component';
import { ComboboxComponent } from './widgets/combobox/combobox.component';
import { FilterByPipe } from './widgets/combobox/pipes/filter-by.pipe';
import { LimitToPipe } from './widgets/combobox/pipes/limit-to.pipe';
import { FieldControlErrorComponent } from './widgets/field-control-error/field-control-error.component';
import { FieldErrorMessageComponent } from './widgets/field-error-message/field-error-message.component';
import { LoadingButtonComponent } from './widgets/loading-button/loading-button.component';
import { LoadingComponent } from './widgets/loading/loading.component';
import { OrderingComponent } from './widgets/ordering/ordering.component';
import { SearchTreePipe } from './widgets/tree/pipes/search-tree.pipe';
import { TreeComponent } from './widgets/tree/tree.component';

import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import { RequiredDirective } from './directives/required.directive';
import { TextFilterPipe } from './pipes/text-filter.pipe';
import { ContentContainerComponent } from './widgets/content-container/content-container.component';
import { LibIconsComponent } from './widgets/lib-icons/lib-icons.component';
import { SearchComboboxComponent } from './widgets/search-combobox/search-combobox.component';
import { TableComponent } from './widgets/table/table.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { FieldContadorMessageComponent } from './widgets/field-contador-message/field-contador-message.component';
import { LibComboboxComponent } from './widgets/lib-combobox/lib-combobox.component';

import { NgxCurrencyDirective } from 'ngx-currency';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotAuthorizedComponent } from './components/page-not-authorized/page-not-authorized.component';
import { DisableControlDirective } from './directives/disable-control.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { LoadingBtnDirective } from './directives/loading-btn.directive';
import { DecimalCommaPipe } from './pipes/decimal-comma.pipe';
import { FilterMultipleChoicePipe } from './pipes/filter-multiple-choice.pipe';
import { FormatByTypePipe } from './pipes/format-by-type.pipe';
import { OrderSortPipe } from './pipes/order-sort.pipe';
import { PhoneFormatPipe } from './pipes/phone-format.pipe';
import { TitleCasePipe } from './pipes/title-case-pipe.pipe';
import { AppliedFiltersComponent } from './widgets/applied-filters/applied-filters.component';
import { ComboboxMultipleChoiceComponent } from './widgets/combobox-multiple-choice/combobox-multiple-choice.component';
import { CustomAcordionComponent } from './widgets/custom-acordion/custom-acordion.component';
import { DropdownOptionsComponent } from './widgets/dropdown-options/dropdown-options.component';
import { DynamicInputComponent } from './widgets/dynamic-input/dynamic-input.component';
import { GenericModalComponent } from './widgets/generic-modal/generic-modal.component';
import { InputTrimComponent } from './widgets/input-trim/input-trim.component';
import { LibHeaderComponent } from './widgets/lib-header/lib-header.component';
import { LibNavProdutosComponent } from './widgets/lib-nav-produtos/lib-nav-produtos.component';
import { InnerListComponent } from './widgets/lib-transfer-list/inner-list/inner-list.component';
import { LibTransferListComponent } from './widgets/lib-transfer-list/lib-transfer-list.component';
import { NavProdutosComponent } from './widgets/nav-produtos/nav-produtos.component';
import { PaginationComponent } from './widgets/pagination/pagination.component';
import { SearchFiltersComponent } from './widgets/search-filters/search-filters.component';
import { SideTabsGenericComponent } from './widgets/side-tabs-generic/side-tabs-generic.component';
import { SimpleSearchComponent } from './widgets/simple-search/simple-search.component';
import { LibSpinnerComponent } from './widgets/spinner/spinner.component';

import { LibConfigSenhaComponent } from './components/lib-config-senha/lib-config-senha.component';
import { TextTruncateDirective } from './directives/text-truncate.directive';
import { CurrencyPipe } from './pipes/currency.pipe';
import { LibCustomizableTableComponent } from './widgets/lib-customizable-table/lib-customizable-table.component';
import { LibDateRangePickerComponent } from './widgets/lib-date-range-picker/lib-date-range-picker.component';
import { LibSimplifiedTableComponent } from './widgets/lib-simplified-table/lib-simplified-table.component';
import { PasswordPolicyComponent } from './widgets/password-policy/password-policy.component';
import { SearchInputComponent } from './widgets/search-input/search-input.component';

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

        PageNotAuthorizedComponent,
        LoadingComponent,
        FieldControlErrorComponent,
        FieldErrorMessageComponent,
        FieldContadorMessageComponent,
        InputTrimComponent,
        LoadingButtonComponent,
        AlertComponent,
        ConfirmComponent,
        ConfirmModalComponent,
        SaveComponent,
        InfraBreadcrumbComponent,
        InfraBreadcrumbItemComponent,
        BreadcrumbComponent,
        ComboboxComponent,
        NavProdutosComponent,
        TreeComponent,
        ToUrlPipe,
        CpfCnpjPipe,
        FilterByPipe,
        LimitToPipe,
        SearchTreePipe,
        ClickOutsideDirective,
        OrderingComponent,
        SearchComboboxComponent,
        LibComboboxComponent,
        RequiredDirective,
        LibHeaderComponent,
        LibIconsComponent,
        TextFilterPipe,
        ContentContainerComponent,
        CopyClipboardDirective,
        TableComponent,
        LibCustomizableTableComponent,
        LibSimplifiedTableComponent,
        LibSpinnerComponent,
        LoadingBtnDirective,
        InputTrimComponent,
        LibTransferListComponent,
        InnerListComponent,
        ComboboxMultipleChoiceComponent,
        CustomAcordionComponent,
        DropdownOptionsComponent,
        DynamicInputComponent,
        GenericModalComponent,
        PaginationComponent,
        SearchFiltersComponent,
        SideTabsGenericComponent,
        SimpleSearchComponent,
        DisableControlDirective,
        HighlightDirective,
        DecimalCommaPipe,
        FilterMultipleChoicePipe,
        OrderSortPipe,
        CurrencyPipe,
        PhoneFormatPipe,
        TitleCasePipe,
        FooterComponent,
        AppliedFiltersComponent,
        FormatByTypePipe,
        LibNavProdutosComponent,
        LibConfigSenhaComponent,
        PasswordPolicyComponent,
        TextTruncateDirective,
        SearchInputComponent,
        LoadingScreenComponent,
        AuditoriaButtonComponent,
        LibDateRangePickerComponent,
        LibAuthenticationConfigComponent,
    ],
    exports: [
        PageNotAuthorizedComponent,
        LoadingComponent,
        FieldControlErrorComponent,
        FieldErrorMessageComponent,
        FieldContadorMessageComponent,
        InputTrimComponent,
        LoadingButtonComponent,
        AlertComponent,
        ConfirmComponent,
        ConfirmModalComponent,
        SaveComponent,
        InfraBreadcrumbComponent,
        InfraBreadcrumbItemComponent,
        NavProdutosComponent,
        BreadcrumbComponent,
        ComboboxComponent,
        TreeComponent,
        ToUrlPipe,
        CpfCnpjPipe,
        ClickOutsideDirective,
        OrderingComponent,
        SearchComboboxComponent,
        LibComboboxComponent,
        RequiredDirective,
        LibHeaderComponent,
        LibIconsComponent,
        TextFilterPipe,
        ContentContainerComponent,
        CopyClipboardDirective,
        TableComponent,
        LibCustomizableTableComponent,
        LibSimplifiedTableComponent,
        LibSpinnerComponent,
        LoadingBtnDirective,
        LibTransferListComponent,
        InnerListComponent,
        ComboboxMultipleChoiceComponent,
        CustomAcordionComponent,
        DropdownOptionsComponent,
        DynamicInputComponent,
        GenericModalComponent,
        PaginationComponent,
        SearchFiltersComponent,
        SideTabsGenericComponent,
        SimpleSearchComponent,
        DisableControlDirective,
        HighlightDirective,
        DecimalCommaPipe,
        FilterMultipleChoicePipe,
        OrderSortPipe,
        CurrencyPipe,
        PhoneFormatPipe,
        TitleCasePipe,
        FooterComponent,
        AppliedFiltersComponent,
        FormatByTypePipe,
        LibNavProdutosComponent,
        LibConfigSenhaComponent,
        PasswordPolicyComponent,
        TextTruncateDirective,
        SearchInputComponent,
        LoadingScreenComponent,
        AuditoriaButtonComponent,
        LibDateRangePickerComponent,
        LibAuthenticationConfigComponent
    ],
    providers: [],
})
export class InfraModule { }
