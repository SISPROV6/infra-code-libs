import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, TrackByFunction, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { RecordCombobox } from '../../models/combobox/record-combobox';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

@Component({
  selector: 'lib-combobox-rework',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LibIconsComponent
  ],
  templateUrl: './lib-combobox-rework.component.html',
  styleUrl: './lib-combobox-rework.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LibComboboxReworkComponent),
      multi: true
    }
  ]
})
export class LibComboboxReworkComponent<T = RecordCombobox> implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy, OnChanges {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private mutationObserver!: MutationObserver;

  
  /** Valor interno do componente */
  private _value: T | T[] | null = null;

  private _search$ = new BehaviorSubject<string>("");

  private _onTouched = () => {};
  private _onChange = (_: T | T[] | null) => {};

  private _destroy$ = new Subject<void>();
  // #endregion PRIVATE

  // #region PUBLIC
  @Input({ required: true }) list: T[] = [];

  /** Informa se, ao selecionar, deve retornar o ID ou o objeto completo */
  @Input({ required: true }) returnID: boolean = false;

  @Input() placeholder = "Selecione uma opção...";
  @Input() searchPlaceholder = "Pesquisa...";
  @Input() noResultsText = "Nenhum registro encontrado com esta pesquisa...";
  @Input() disabled = false;
  @Input() multiple = false;
  @Input() innerFilter = true;
  @Input() customLabel: string = "LABEL";
  @Input() customValue: string = "ID";

  @ContentChild("optionTemplate", { read: TemplateRef, static: false }) optionTemplate?: TemplateRef<any>;
  @ContentChild("leftButtonTemplate", { read: TemplateRef, static: false }) leftButtonTemplate?: TemplateRef<any>;
  @ContentChild("rightButtonTemplate", { read: TemplateRef, static: false }) rightButtonTemplate?: TemplateRef<any>;

  @ViewChild("toggleButton", { static: true }) toggleButton?: ElementRef<HTMLButtonElement>;

  @Output() selectionChange = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<string | null>();
  @Output() filterButtonClick = new EventEmitter<string | null>();

  public selectedValues: T[] | null = null;

  // Getter/Setter para o valor
  public get value(): T | T[] | null { return this._value; }
  public set value(val: T | T[] | null) {
    if (val !== this._value) {
      this._value = val;
      this._onChange(this.formatReturn(val)); // Notifica o FormControl sobre a mudança
    }
  }

  public invalid: boolean = false;

  public isOpen = false;
  public searchControl = new FormControl("");

  public filteredItems$: Observable<T[]> = this._search$.pipe(
    debounceTime(150),
    distinctUntilChanged(),
    map((term) => this.filterItems(term))
  );
  
  public compare = (a: T, b: T): boolean => {
    if (!a || !b) return false;

    const recA = a as unknown as any;
    const recB = b as unknown as any;

    if (a === b)
      return true;

    else if ( (recA[this.customValue] === recB[this.customValue]) || (recA[this.customLabel] === recB[this.customLabel]) )
      return true;

    return false;
  }

  // public compareWith: (a: T, b: T) => boolean = (a, b) => a === b;
  public displayWith: (item: T) => string = (item) => {
    if (!item) return '';
    if (typeof item === 'object') {
      const rec = item as unknown as any;
      return rec[this.customLabel] ?? String(rec[this.customValue] ?? '');
    }
    return String(item);
  };

  public displayValue(): string {
    if (!this.value) return this.placeholder;
    
    if (Array.isArray(this.value)) {
      if (this.value.length === 0) return this.placeholder;

      let extraSelected: number = 0;

      this.value.forEach((e, index) => {
        if (index >= 2) extraSelected++;
      });

      // Filtra o valor para exibir até dois valores selecionados, se passar disso mostra "e +{n} selecionado(s)"
      return this.value.map((e, index) => {
        if (index < 2) return this.displayWith(e);
        return null;
      })
      .filter(e => e !== null)
      .join(', ') + (extraSelected > 0 ? ` e +${extraSelected} selecionado(s)` : '');
    }

    return this.displayWith(this.value as T);
  }

  trackByFn!: TrackByFunction<T | any>;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor(
    private _cdr: ChangeDetectorRef,
    private _elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(takeUntil(this._destroy$), debounceTime(200))
      .subscribe((v) => {
        if (this.innerFilter) this._search$.next(v ?? "");
        else this.filterChange.emit(v);
      });
    
    this.registerObserver();
  }

  ngAfterViewInit() {
    // [...]
  }

  ngAfterContentInit() {
    this.setMaxWidth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // [...]
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();

    this.mutationObserver.disconnect();
  }

  // O que fazer quando o evento de redimensionamento da tela ocorrer
  @HostListener('window:resize', ['$event'])
  onResize(): void { this.setMaxWidth(); }


  // #region ==========> UTILS <==========

  private filterItems(term: string): T[] {
    if (!term) return this.list;
    
    const t = term.toLowerCase();
    return this.list.filter((item) => {
      const label =
      typeof item === 'object'
      ? (item as unknown as any)[this.customLabel] ?? ''
      : String(item);

      return label.toLowerCase().includes(t);
    });
  }


  // #region Seleção
  public select(item: T): void {
    if (this.multiple) {
      this.selectedValues = Array.isArray(this.value) ? [...this.value] : [];
      const index = this.selectedValues.findIndex(v => this.compare(v, item));

      if (index > -1) this.selectedValues.splice(index, 1);
      else this.selectedValues.push(item);

      if (this.selectedValues.length === 0) this.selectedValues = null;

      this.value = this.selectedValues;
      this.selectionChange.emit(this.selectedValues);
    }
    else {
      this.value = item;
      this.selectionChange.emit(item);
      this.closeDropdown();
    }

    this._onTouched();
  }

  public isSelected(item: T) {
    if (!item || !this.value) return false;

    if (this.multiple && Array.isArray(this.value)) {
      return this.value.some(v => this.compare(v, item));
    }

    return this.compare(item, this.value as T);
  }

  /**
   * "Harmoniza" um valor primitivo de "ID" e encontra o seu item correspondente na lista
   * @param val Valor a ser resolvido
   * @returns O item correspondente ou null
  */
  private resolveValue(val: any): T | null {
    // Se já é um objeto com a propriedade customValue, retorna direto
    if (typeof val === 'object' && val !== null && val[this.customValue] !== undefined) {
      return val;
    }

    // Se é um valor primitivo, tenta encontrar na lista
    const match = this.list?.find((item: any) => item[this.customValue] === val);
    return match ?? null;
  }

  /** Formata o valor de retorno com base na configuração de retorno */
  private formatReturn(val: any) {
    if (this.returnID && val) {
      if (this.multiple && Array.isArray(val)) {
        // Retorna a lista de IDs
        return val.map(v => (v as any)[this.customValue]);
      }
      else {
        // Retorna o ID do item
        return (val as any)[this.customValue]
      }
    }

    return val;
  }
  // #endregion Seleção

  // #region VALUE_ACCESSOR do Angular

  public writeValue(obj: T | T[] | null): void {
    if (!obj) this.selectedValues = null;

    this._onTouched();

    if (this.multiple && obj) {
      this.selectedValues = Array.isArray(obj)
        ? obj.map(val => this.resolveValue(val)).filter((v): v is T => v !== null)
        : [];

      if (this.selectedValues.length === 0) this.selectedValues = null;

      this.value = this.selectedValues;
      this.selectionChange.emit(this.selectedValues);
    }
    else {
      const resolved = this.resolveValue(obj);

      this.value = resolved;
      this.selectionChange.emit(resolved);
    }

    this._cdr.markForCheck();
  }

  public registerOnChange(fn: (value: T | T[] | null) => void): void { this._onChange = fn; }
  public registerOnTouched(fn: () => void): void { this._onTouched = fn; }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cdr.markForCheck();
  }
  // #endregion VALUE_ACCESSOR do Angular

  // #region UI
  public toggleDropdown() {
    if (this.disabled) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.searchControl.setValue("", { emitEvent: true });
      setTimeout(() => {
        const inputEl: HTMLInputElement | null = document.querySelector('.reusable-combobox .dropdown-search input');
        inputEl?.focus();
      }, 0);
    }

    this._cdr.markForCheck();
  }

  public openDropdown() {
    if (this.disabled) return;

    this.isOpen = true;

    if (this.isOpen) {
      this.searchControl.setValue("", { emitEvent: true });
      setTimeout(() => {
        const inputEl: HTMLInputElement | null = document.querySelector('.reusable-combobox .dropdown-search input');
        inputEl?.focus();
      }, 0);
    }

    this._cdr.markForCheck();
  }

  public closeDropdown(): void {
    this.isOpen = false;
    this._cdr.markForCheck();
  }

  public onBlurOutside(event: FocusEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.reusable-combobox')) {
      this.closeDropdown();
    }
  }

  /** Define a largura máxima em pixels com base na largura do container pai
   * 
   * Esta abordagem foi necessária pois o elemento em questão constantemente aumentava sua largura para acomodar o seu valor interno, independente das regras CSS impostas.
   * 
   * A solução mais rápida era definir uma largura em pixels fixa na inicialização, o que não é o ideal por questões de responsividade, portanto este método é chamado em caso de resize da tela também
  */
  private setMaxWidth(): void {
    if (this.toggleButton) {
      const container = this.toggleButton?.nativeElement;
      const parent = this.toggleButton?.nativeElement.parentElement;

      container.style.minWidth = '100%';
      container.style.width = `${parent!.scrollWidth}px`;
    }
  }
  // #endregion UI

  // #region Mutation Observer

  private registerObserver() {
    this.mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mut => {
        if (mut.type === 'attributes' && mut.attributeName === 'class') this.checkInvalidClass();
      });
    });

    this.mutationObserver.observe(this._elementRef.nativeElement, {
      attributes: true,
      attributeFilter: [ 'class', 'disabled' ]
    });

    setTimeout(() => this.checkInvalidClass());
  }

  private checkInvalidClass() {
    const hasInvalid = this._elementRef.nativeElement.classList.contains('is-invalid');

    this.invalid = hasInvalid;
    this._cdr.markForCheck();
  }

  // #endregion Mutation Observer

  // #endregion ==========> UTILS <==========

}
