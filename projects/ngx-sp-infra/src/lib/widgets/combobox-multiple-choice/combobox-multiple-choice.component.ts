import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RecordCombobox } from '../../models/combobox/record-combobox';
import { FilterMultipleChoicePipe } from '../../pipes/filter-multiple-choice.pipe';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

@Component({
  selector: 'app-combobox-multiple-choice, lib-combobox-multiple',
  templateUrl: './combobox-multiple-choice.component.html',
  styleUrls: ['./combobox-multiple-choice.component.scss'],

  imports: [LibIconsComponent, NgIf, NgFor, NgClass, TooltipModule, FilterMultipleChoicePipe]
})
export class ComboboxMultipleChoiceComponent implements OnInit {

  /**
   *
   */
  constructor(private _breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.initMobileObserver();
  }

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  @Output('resetFilter') private readonly _EMIT_RESET_FILTER: EventEmitter<void> = new EventEmitter<void>();
  private _isMobile: boolean = false;
  // #endregion PRIVATE

  // #region PROTECTED
  protected search: string = '';

  protected get selectedOptions(): RecordCombobox[] { return this.options.filter(e => e.IS_SELECTED); }
  protected get selectedLabels(): string { return this.selectedOptions.map(option => option.LABEL).join(', '); }

  @Output('change') protected readonly EMIT_CHANGE: EventEmitter<string | number> = new EventEmitter<string | number>();
  // #endregion PROTECTED

  // #region PUBLIC
  @Input({ required: true }) public options!: RecordCombobox[];
  @Input() public placeholder: string = 'Selecione uma ou mais opções';
  @Input() public disabled: boolean = false;
  public get isMobile(): boolean { return this._isMobile };
  // REVISAR
  @Input() public showLimparBtn: boolean = true;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> UTILITIES <==========
  protected resetFilter(): void {
    this.options.forEach(e => e.IS_SELECTED = false);
    this._EMIT_RESET_FILTER.emit();
    this.EMIT_CHANGE.emit();
  }

  public initMobileObserver() {
    this._breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this._isMobile = true;
      }else{
        this._isMobile = false;
      }
    });
  }

  public LimitarTexto(texto: string, limite: number) {
    if (texto == null || texto == "") {
      return (texto);
    }

    if (texto.length <= limite) {
      return texto;
    }

    return texto.substring(0, limite) + "...";
  }

  // #endregion ==========> UTILITIES <==========



}
