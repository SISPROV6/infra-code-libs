import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, TemplateRef, TrackByFunction, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { RecordCombobox } from '../../models/combobox/record-combobox';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

/*
How to use

1) Import module:

  import { ReusableComboboxModule } from 'src/app/shared/reusable-combobox/reusable-combobox.module';

  @NgModule({
    imports: [ReusableComboboxModule, ...]
  })
  export class SomeModule {}

2) Reactive form example (in consuming component):

  // TS
  control = new FormControl();
  items = [
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' },
    { value: 3, label: 'Three' }
  ];

  // HTML
  <app-reusable-combobox [items]="items" [placeholder]="'Choose'" [formControl]="control"
                         (selectionChange)="onSelect($event)">
    <!-- custom option template: name it 'optionTemplate' when using ContentChild selector -->
    <ng-template #optionTemplate let-item>
      <div class="d-flex align-items-center">
        <div class="flex-grow-1">Custom: {{ item.label }}</div>
      </div>
    </ng-template>
  </app-reusable-combobox>

Notes
- The component implements ControlValueAccessor, so you may use [formControl] or formControlName in a FormGroup.
- To provide a custom option template, project an <ng-template #optionTemplate> inside the component usage. The template receives the option as the implicit context (let-item).
- The component uses Bootstrap 5 classes but the styles are in its SCSS file; override via global styles or provide additional classes.
- Extensibility: hooks are in place to add virtual scroll, multi-select, async loading, or keyboard navigation. Search/filter is implemented via an internal FormControl with a short debounce.
*/
@Component({
  selector: 'lib-combobox-rework',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LibIconsComponent
  ],
  templateUrl: './lib-combobox-rework.component.html',
  styleUrl: './lib-combobox-rework.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LibComboboxReworkComponent),
      multi: true
    }
  ]
})
export class LibComboboxReworkComponent<T = RecordCombobox> implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _search$ = new BehaviorSubject<string>("");

  private _onTouched = () => {};
  private _onChange = (_: T | null) => {};

  private _destroy$ = new Subject<void>();
  // #endregion PRIVATE

  // #region PUBLIC
  @Input() list: T[] = [];
  @Input() placeholder = "Selecione uma opção...";
  @Input() searchPlaceholder = "Pesquisa...";
  @Input() noResultsText = "Nenhum registro encontrado com esta pesquisa...";
  @Input() disabled = false;
  @Input() multiple = false;

  /** Property of T to display in the UI */
  @Input() customLabel: string = "LABEL";

  /** Property of T to use as the bound value */
  @Input() customValue: string = "ID";

  public compareWith: (a: T, b: T) => boolean = (a, b) => a === b;
  public displayWith: (item: T) => string = (item) => {
    if (!item) return '';
    if (typeof item === 'object') {
      const rec = item as unknown as any;
      return rec[this.customLabel] ?? String(rec[this.customValue] ?? '');
    }
    return String(item);
  };

  /** Template para opção customizada (consumido via content-projection) */
  @ContentChild("optionTemplate", { read: TemplateRef, static: false }) optionTemplate?: TemplateRef<any>;
  @ContentChild("leftButtonTemplate", { read: TemplateRef, static: false }) leftButtonTemplate?: TemplateRef<any>;
  @ContentChild("rightButtonTemplate", { read: TemplateRef, static: false }) rightButtonTemplate?: TemplateRef<any>;

  @ViewChild("toggleButton", { static: true }) toggleButton?: ElementRef;

  @Output() selectionChange = new EventEmitter<any>();

  // Estados internos
  public isOpen = false;
  public searchControl = new FormControl("");

  public filteredItems$: Observable<T[]> = this._search$.pipe(
    debounceTime(150),
    distinctUntilChanged(),
    map((term) => this.filterItems(term))
  );

  public value: T | null = null;

  trackByFn!: TrackByFunction<T | any>;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor(private _cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((v) => this._search$.next(v ?? ""));
  }

  ngAfterViewInit() {
    // nothing for now, placeholder for future keyboard focus handling
    console.log(this.optionTemplate);
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }


  // #region ==========> UTILS <==========
  public writeValue(obj: T | null): void {
    this.value = obj;
    this._onTouched();
    this.selectionChange.emit(obj);
    this._cdr.markForCheck();
  }

  public registerOnChange(fn: (value: T | null) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

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

  public select(item: T): void {
    this.value = item;
    this._onChange(item);
    this._onTouched();
    this.selectionChange.emit(item);
    this.closeDropdown();
  }

  private filterItems(term: string): T[] {
    if (!term) return this.list;
    
    const t = term.toLowerCase();
    return this.list.filter((item) => {
      const label =
        typeof item === 'object'
          ? (item as unknown as RecordCombobox).LABEL ?? ''
          : String(item);
      return label.toLowerCase().includes(t);
    });
  }

  public isSelected(item: T) {
    if (!item || !this.value) return false;
    return this.compareWith(item, this.value);
  }

  public onBlurOutside(event: FocusEvent) {
    const target = event.target as HTMLElement;

    console.log(event);
    console.log(target);

    if (!target.closest('.reusable-combobox')) {
      this.closeDropdown();
    }
  }
  // #endregion ==========> UTILS <==========

}
