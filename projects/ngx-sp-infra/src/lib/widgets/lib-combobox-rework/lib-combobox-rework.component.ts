import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, TemplateRef, TrackByFunction, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

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
  selector: 'lib-lib-combobox-rework',
  imports: [ CommonModule, ReactiveFormsModule ],
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
export class LibComboboxReworkComponent<T = any> implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {

  // Core data
  @Input() items: any[] | T[] = [];
  @Input() placeholder = "Select...";
  @Input() searchPlaceholder = "Search...";
  @Input() noResultsText = "No results";
  @Input() disabled = false;
  @Input() compareWith: (a: any, b: any) => boolean = (a, b) => a === b;
  @Input() displayWith: (item: any) => string = (item) => (item && item.label) || String((item && item.value) ?? item ?? "");

  // Template for custom option (consumed via content projection)
  @ContentChild("optionTemplate", { read: TemplateRef, static: false }) optionTemplate?: TemplateRef<any>;

  @ViewChild("toggleButton", { static: true }) toggleButton?: ElementRef;

  @Output() selectionChange = new EventEmitter<any>();

  // Internal state
  isOpen = false;
  searchControl = new FormControl("");
  private search$ = new BehaviorSubject<string>("");
  filteredItems$ = this.search$.pipe(
    debounceTime(150),
    distinctUntilChanged(),
    map((term) => this.filterItems(term))
  );

  value: any = null;

  private onTouched = () => {};
  private onChange = (_: any) => {};
  private destroy$ = new Subject<void>();
  trackByFn!: TrackByFunction<any>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((v) => this.search$.next(v ?? ""));
  }

  ngAfterViewInit() {
    // nothing for now, placeholder for future keyboard focus handling
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  toggleDropdown() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // reset search when opening
      this.searchControl.setValue("", { emitEvent: true });
      setTimeout(() => {
        // focus search input if present
        const inputEl: HTMLInputElement | null = document.querySelector(
          '.reusable-combobox .dropdown-search input'
        );
        inputEl?.focus();
      }, 0);
    }
    this.cdr.markForCheck();
  }

  closeDropdown() {
    this.isOpen = false;
    this.cdr.markForCheck();
  }

  select(item: any) {
    this.value = item;
    this.onChange(item);
    this.onTouched();
    this.selectionChange.emit(item);
    this.closeDropdown();
  }

  private normalizeItems(): any[] {
    if (!Array.isArray(this.items)) return [];
    // If items are plain values, wrap them
    return this.items.map((it: any) => {
      if (typeof it === "object" && ("value" in it || "label" in it)) return it as any;
      return { value: it, label: String(it) } as any;
    });
  }

  private filterItems(term: string) {
    const normalized = this.normalizeItems();
    if (!term) return normalized;
    const t = term.toLowerCase();
    return normalized.filter((i) => (i.label ?? String(i.value)).toLowerCase().includes(t));
  }

  isSelected(item: any) {
    return this.compareWith((item && item.value) ?? item, (this.value && this.value.value) ?? this.value);
  }

  onBlurOutside(event: FocusEvent) {
    // crude: close when clicked outside
    const target = event.target as HTMLElement;
    if (!target.closest('.reusable-combobox')) {
      this.closeDropdown();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
