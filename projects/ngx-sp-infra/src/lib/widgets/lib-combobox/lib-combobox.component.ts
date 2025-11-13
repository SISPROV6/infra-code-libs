import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormControlStatus, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { NgIf } from '@angular/common';
import { RequiredDirective } from '../../directives/required.directive';
import { RecordCombobox } from '../../models/combobox/record-combobox';
import { TextFilterPipe } from '../../pipes/text-filter.pipe';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

/**
 * @component LibComboboxComponent
 * @selector lib-combobox
 * 
 * @description
 * O componente LibComboboxComponent é projetado para fornecer aos usuários uma interface para pesquisar e selecionar itens de uma lista.
 * Ele suporta a filtragem de itens com base na entrada do usuário, permitindo uma seleção mais fácil em listas extensas.
 * 
 * ## Funcionalidades:
 * - Pesquisa e filtragem de itens na lista do combobox.
 * - Seleção de itens com feedback visual.
 * - Emissão de eventos personalizados para interações do usuário, como recarregar a lista ou selecionar um item.
 * - Ajuste dinâmico da largura do dropdown para corresponder ao input principal.
 * - Inicialização de um valor selecionado, se fornecido.
 * 
 * ## Inputs:
 * - `control` (FormControl | AbstractControl): Control para seleção dos valores, atualizará automaticamente o control do componente pai também
 * - `comboboxList` (RecordCombobox[]): Lista de registros que serão exibidos no combo, enquanto eles estiverem carregando será exibido um spinner
 * - `labelText` (string): Texto do rótulo que será exibido acima do combo. Caso não informado nada será exibido
 * - `disabled` (boolean): Define se o campo está desabilitado. Deve ser usado para validações de habilitação dinâmica do campo
 * - `libRequired` (boolean): Define se o campo é obrigatório, vai exibir o '*' vermelho ao lado do label (se ele estiver presente)
 * - `mainInputPlaceholder` (string): Placeholder do campo principal do combo
 * - `searchInputPlaceholder` (string): Placeholder do campo de pesquisa dentro do combo
 * - `colorTheme` ("primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"): Define o tema de cor do componente, como "primary", "success", ou "danger"
 * - `returnRecord` (boolean): Define se o tipo de retorno ao selecionar uma opção será o Record inteiro ou apenas o ID
 * 
 * ## Outputs:
 * - `onReloadList` (EventEmitter<string>): Evento emitido quando a lista precisa ser recarregada.
 */
@Component({
  selector: 'lib-combobox',
  templateUrl: './lib-combobox.component.html',
  styles: `
    .glb-max-height-350px { max-height: 350px !important; }
    .form-label { font-size: 16px !important; }
    .z-index-1020 { z-index: 1020 !important; }
    .cursor-pointer { cursor: pointer !important; }
    .dropdown-menu { position: relative; }
  `,
  
  imports: [
    NgIf,
    RequiredDirective,
    FormsModule,
    ReactiveFormsModule,
    LibIconsComponent,
    FieldErrorMessageComponent,
    TextFilterPipe,
  ],
})
export class LibComboboxComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  // #region ==========> PROPERTIES <==========

  // #region PROTECTED
  protected textoPesquisa: string = "";

  protected get ariaExpanded(): boolean { return this._ariaExpanded; }
  protected set ariaExpanded(value: boolean) {
    this._ariaExpanded = value;
    this.adjustDropdownWidth();
    
    if (value === false) {
      this.textoPesquisa = "";

      // Validação para caso o input de pesquisa esteja escondido
      if (this._searchInput) this._searchInput.nativeElement.value = "";
    }
  }

  protected innerControl: FormControl = new FormControl<string | number | null>(null);
  protected invalidControl: boolean = false;
  protected isRequired: boolean = false;

  protected invalid: boolean = false;
  protected dirty: boolean = false;
  protected touched: boolean = false;

  protected comboboxID!: string;
  protected labelID!: string;
  private _labelText: string | null | undefined;
  // #endregion PROTECTED

  // #region PRIVATE
  private _disabled?: boolean = false;
  private _ariaExpanded: boolean = false;
  private _subscription: Subscription = new Subscription();

  private _outerControl: FormControl = new FormControl<string | number | null>(null);
  // #endregion PRIVATE

  // #region PUBLIC

  /** (obrigatório) Control para seleção dos valores, atualizará automaticamente o control do componente pai também
   * @alias 'control'
   * @type {FormControl<any> | AbstractControl<any>} */
  @Input({ required: true })
  public get control(): FormControl<unknown> { return this._outerControl }
  public set control(value: FormControl<unknown> | AbstractControl<unknown>) {
    this._outerControl = value as FormControl;

    // Cancela a subscrição anterior (se houver) para evitar múltiplas subscrições
    if (this._subscription) this._subscription.unsubscribe();

    // Subscrição ao observável valueChanges para reagir a mudanças no valor
    this._subscription = this._outerControl.valueChanges.subscribe(value => { this.updateSelectedValue(value) });
    this._subscription = this._outerControl.statusChanges.subscribe(status => { this.setControlStatus(status) });
  }

  /** (obrigatório) Lista de registros que serão exibidos no combo, enquanto eles estiverem carregando será exibido um spinner
   * @alias 'list'
   * @type {RecordCombobox[]} */
  @Input({ required: true }) public list?: RecordCombobox[];

  /** (opcional) Texto do rótulo que será exibido acima do combo. Caso não informado nada será exibido
   * @type {string | null | undefined} */
  @Input()
  public get labelText(): string | null | undefined { return this._labelText; }
  public set labelText(value: string | null | undefined) {
    this._labelText = value;
    this.changeSeparator(value);
  }

  /** (opcional) Texto ou caractere separador entre a informação de ID e LABEL
   * @example " - "
   * @type {string} */
  @Input() public separator?: string = " ";

  /** (opcional) Define se o campo é obrigatório, vai exibir o '*' vermelho ao lado do label (se ele estiver presente)
   * @type {boolean} */
  @Input()
  public libRequired?: boolean;

  /** (opcional) Define se o campo está desabilitado. Deve ser usado para validações de habilitação dinâmica do campo
   * @type {boolean}
   * @default false */
  @Input()
  public get disabled(): boolean { return this._disabled ?? false; }
  public set disabled(value: boolean | undefined) {
    if (value && value === true) this.innerControl.disable();
    else this.innerControl.enable();

    //this.setControlStatus();
  }

  /** (opcional) Placeholder do campo principal do combo
   * @alias 'mainPlaceholder'
   * @type {string}
   * @default "Selecione uma opção..." */
  @Input() public mainPlaceholder?: string = "Selecione uma opção...";

  /** (opcional) Placeholder do campo de pesquisa dentro do combo
   * @alias 'searchPlaceholder'
   * @type {string}
   * @default "Pesquisa..." */
  @Input() public searchPlaceholder?: string = "Pesquisa...";

  /** (opcional) Define o tema de cor do componente, como "primary", "success", ou "danger"
   * @alias 'theme'
   * @type {string}
   * @default "primary"
  */
  @Input() public theme?: string = "primary";

  /** (opcional) Define se o tipo de retorno ao selecionar uma opção será o Record inteiro ou apenas o ID.
   * @type {boolean}
   * @default false
  */
  @Input() public returnRecord?: boolean = false;

  /** (opcional) Define se o código extra chamado 'AdditionalStringProperty1' será exibido em negrito ou não.
   * @type { boolean }
   * @default true
  */
  @Input() public additionalStringBold?: boolean = true;

  /** (opcional) Define se a mensagem de erro do input deve ser exibida ou escondida em caso de erro de valor no input.
   * @type { boolean }
   * @default true
  */
  @Input() public showErrorMessage?: boolean = true;

  /** Evento emitido ao recarregar a lista de registros
   * @example Ao ser emitido, o componente pai pode refazer o GET da lista, por exemplo.
   * @emits EventEmitter<string> que leva o valor string da pesquisa feita para ser enviada para o GET
   * @type {EventEmitter<string>} */
  @Output() public reloadListChange: EventEmitter<string> = new EventEmitter<string>();


  /** Evento emitido ao selecionar um registro da lista do combobox
   * @example Ao ser emitido, o componente pai pode realizar uma validação com o valor selecionado.
   * @emits EventEmitter<string|number|null> que leva o valor string da pesquisa feita para ser enviada para o GET
   * @type {EventEmitter<string | number | null>} */
  @Output() public changeValue: EventEmitter<RecordCombobox | string | number | null> = new EventEmitter<RecordCombobox | string | number | null>();
  
  
  /** Evento emitido ao mudar o valor do campo de pesquisa
   * @example Ao ser emitido, o componente pai pode realizar uma validação ou nova query com o valor selecionado.
   * @emits EventEmitter<string> que leva o valor string da pesquisa feita para ser enviada para o GET
   * @type {EventEmitter<string>} */
  @Output() public changePesquisa: EventEmitter<string> = new EventEmitter<string>();
  

  @ViewChild('mainInput') private _mainInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchInput', { static: false }) private _searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild('dropdownMenu') private _dropdownMenu!: ElementRef<HTMLDivElement>;

  public showSearchInput: boolean = false;

  /** Foca no input de pesquisa interna, levando em consideração se ele está escondido ou não. */
  public focusSearchInput(): void {
    if (this._searchInput) this._searchInput.nativeElement.focus();
  }
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor() { }

  ngOnInit(): void {
    this.comboboxID = `lib-combobox-${Math.random() * 100}`;
    this.labelID = `${Math.random() * 100}`;

    this.adjustDropdownWidth();

    this.setValidator();
    this.updateSelectedValue();

  }

  ngAfterViewInit(): void {
    this.adjustDropdownWidth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["list"]?.currentValue) this.updateSelectedValue();

    if(changes["list"] && this.list){
      this.showSearchInput = this.list.length > 5;
    }

    if (changes["libRequired"]?.currentValue != undefined) this.setValidator();
    
    if (changes["control"]?.currentValue) {
      this.setValidator();
      this.updateSelectedValue((changes["control"].currentValue as FormControl).value);
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }


  // #region ==========> UTILS <==========
  public setValue(item: RecordCombobox): void {
    this.textoPesquisa = "";
    this.innerControl.markAsDirty();
    this._outerControl.markAsDirty();
    
    this._outerControl.setValue(item.ID);
    this.innerControl.setValue(
      `${item.AdditionalStringProperty1 && item.AdditionalStringProperty1 != '' ? item.AdditionalStringProperty1 : ""}${this.separator === undefined ? " " : " "+this.separator+" "}${item.LABEL}`
    );

    this.ariaExpanded = false;
    this.setControlStatus(this.innerControl.status);
    
    this.changeValue.emit(this.returnRecord ? item as RecordCombobox : item.ID);
  }

  public clearValue(): void {
    this.textoPesquisa = "";
    this.innerControl.markAsDirty();
    this._outerControl.markAsDirty();

    this._outerControl.setValue(null);
    this.innerControl.setValue(null);

    this.ariaExpanded = false;
    this.setControlStatus(this.innerControl.status);

    this.changeValue.emit(null);
  }

  private updateSelectedValue(value?: string | number | null, noChange: boolean = true): void {
    this.innerControl.setValue(null); // Limpa o campo antes de qualquer coisa
    
    const selectedValue: string | number | null = value ?? this._outerControl.value;
    if (!this.list || (selectedValue === null && selectedValue === '')) return;
    
    const initializedValue = this.list.find(item => item.ID === selectedValue)
    if (initializedValue) this.innerControl.setValue(
      `${initializedValue.AdditionalStringProperty1 && initializedValue.AdditionalStringProperty1 != '' ? initializedValue.AdditionalStringProperty1 : ""}${this.separator === undefined ? "" : " "+this.separator+" "}${initializedValue.LABEL}`,
      { emitEvent: noChange }
    );
  }

  private changeSeparator(newSeparator: string | null | undefined): void {
    const initializedValue = this.list ? this.list.find(item => item.ID === this._outerControl.value) : null;
    let formattedValue: string | null = null;

    if (initializedValue) {
      formattedValue = `${initializedValue.AdditionalStringProperty1 && initializedValue.AdditionalStringProperty1 !== '' ? initializedValue.AdditionalStringProperty1 : ""}${newSeparator === undefined || newSeparator === null ? "" : " "+newSeparator+" "}${initializedValue.LABEL}`;
    }

    if (initializedValue) this.innerControl.setValue(formattedValue, { emitEvent: false });
  }

  private adjustDropdownWidth(): void {
    if (this._mainInput && this._dropdownMenu) {
      const inputWidth = this._mainInput.nativeElement.offsetWidth;
      this._dropdownMenu.nativeElement.style.width = `${inputWidth}px`;
    }
  }

  /** Serve para aplicar ou remover o Validator.required do controle.
   * Por padrão ele priorizará a propriedade libRequired para esta validação. */
  private setValidator(): void {
    if (this.libRequired !== undefined) {
      if (this.libRequired) {
        this.innerControl.addValidators(Validators.required);
        this.isRequired = true;
      }
      else {
        this.innerControl.removeValidators(Validators.required);
        this.isRequired = false;
      }
    }
    else {
      if (this._outerControl.hasValidator(Validators.required)) {
        this.innerControl.addValidators(Validators.required);
        this.isRequired = true;
      }
      else {
        this.innerControl.removeValidators(Validators.required);
        this.isRequired = false;
      }
    }
  }

  private setControlStatus(formStatus: FormControlStatus): void {
    switch(formStatus) {
      case 'VALID':
        this.invalidControl = false;
        this.innerControl.enable();
        break;

      case 'INVALID':
        this.invalidControl = true;
        this.innerControl.enable();
        break;

      case 'PENDING':
        this.invalidControl = false;
        this.innerControl.enable();
        break;

      case 'DISABLED':
        this.invalidControl = false;
        this.innerControl.disable();
        break;
    }
  }

  public reloadList(): void { this.reloadListChange.emit(this.textoPesquisa) }
  // #endregion ==========> UTILS <==========

}