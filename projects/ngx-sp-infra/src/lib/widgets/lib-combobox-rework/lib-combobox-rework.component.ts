import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, TrackByFunction, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { TextTruncateDirective } from '../../directives/text-truncate.directive';
import { RecordCombobox } from '../../models/combobox/record-combobox';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

@Component({
  selector: 'lib-combobox-rework',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LibIconsComponent,
    TextTruncateDirective
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
  private _search$ = new BehaviorSubject<string>("");

  private _onTouched = () => {};
  private _onChange = (_: T | T[] | null) => {};

  private _destroy$ = new Subject<void>();
  // #endregion PRIVATE

  // #region PUBLIC
  @Input() list: T[] = [];

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

  @ViewChild("toggleButton", { static: true }) toggleButton?: ElementRef;

  @Output() selectionChange = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<string | null>();
  @Output() filterButtonClick = new EventEmitter<string | null>();

  public value: T | T[] | null = null;
  public selectedValues: T[] | null = null;

  public isOpen = false;
  public searchControl = new FormControl("");

  public filteredItems$: Observable<T[]> = this._search$.pipe(
    debounceTime(150),
    distinctUntilChanged(),
    map((term) => this.filterItems(term))
  );
  
  public compareWith: (a: T, b: T) => boolean = (a, b) => a === b;
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
      return this.value.map(v => this.displayWith(v)).join(', ');
    }

    return this.displayWith(this.value as T);
  }

  trackByFn!: TrackByFunction<T | any>;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor(private _cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(takeUntil(this._destroy$), debounceTime(200))
      .subscribe((v) => {
        if (this.innerFilter) this._search$.next(v ?? "");
        else this.filterChange.emit(v);
      });
  }

  ngAfterViewInit() {
    // nothing for now, placeholder for future keyboard focus handling
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }


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
      const index = this.selectedValues.findIndex(v => this.compareWith(v, item));

      if (index > -1) this.selectedValues.splice(index, 1);
      else this.selectedValues.push(item);

      if (this.selectedValues.length === 0) this.selectedValues = null;

      this.value = this.selectedValues;
      this._onChange(this.selectedValues);
      this.selectionChange.emit(this.selectedValues);
    }
    else {
      this.value = item;
      this._onChange(item);
      this.selectionChange.emit(item);
      this.closeDropdown();
    }

    this._onTouched();
  }

  public isSelected(item: T) {
    if (!item || !this.value) return false;

    if (this.multiple && Array.isArray(this.value)) {
      return this.value.some(v => this.compareWith(v, item));
    }

    return this.compareWith(item, this.value as T);
  }
  // #endregion Seleção

  // #region VALUE_ACCESSOR do Angular
  public writeValue(obj: T | T[] | null): void {
    if (!obj) this.selectedValues = null;

    this.value = obj;
    this._onTouched();
    this.selectionChange.emit(obj);
    this._cdr.markForCheck();
  }

  public registerOnChange(fn: (value: T | T[] | null) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
  // #endregion VALUE_ACCESSOR do Angular

  // #region UI
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cdr.markForCheck();
  }

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
  // #endregion UI

  // #endregion ==========> UTILS <==========

}
