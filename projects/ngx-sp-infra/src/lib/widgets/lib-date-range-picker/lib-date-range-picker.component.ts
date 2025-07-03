import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';


export interface CalenderDay {
  date: number;
  fullDate: Date;
  otherMonth: boolean;
}


@Component({
  selector: 'lib-date-range-picker',
  templateUrl: './lib-date-range-picker.component.html',
  styleUrl: './lib-date-range-picker.component.scss',
  imports: [
    CommonModule,
    LibIconsComponent
  ]
})
export class LibDateRangePickerComponent {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private readonly _currentDate = new Date();
  private _currentMonth = this._currentDate.getMonth();
  private _startDate: Date | null = null;
  private _endDate: Date | null = null;
  private _selecting: 'start' | 'end' = 'start';
  // #endregion PRIVATE

  // #region PUBLIC
  @Output() dateRangeSelected = new EventEmitter<{ startDate: string, endDate: string }>();
  @Output() datesCleared = new EventEmitter<void>();

  public showCalendar = false;
  public currentYear = this._currentDate.getFullYear();
  public weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  public calendarDays: CalenderDay[] = [];  
  
  public inputText = '';
  public errorMessage: string = '';
  
  public showYearSelector = false;
  public yearSelectorStartYear = Math.floor(this.currentYear / 12) * 12;
  public yearSelectorYears: number[] = [];

  get currentMonthName(): string {
    return new Date(this.currentYear, this._currentMonth, 1).toLocaleString('pt-BR', { month: 'long' });
  }
  get displayText(): string {
    if (!this._startDate) return this.inputText;

    const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');

    if (!this._endDate) return `${formatDate(this._startDate)} - ...`;
    
    return `${formatDate(this._startDate)} - ${formatDate(this._endDate)}`;
  }
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor( private readonly elementRef: ElementRef ) {
    this.generateCalendarDays();
    this.generateYearSelectorYears();
    this.syncCalendarWithDates();
  }


  // #region ==========> UTILS <==========

  /** Método para formatar automaticamente o input de texto */
  public formatInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
    
    if (value.length === 0) {
      this.clearDates(); 
      return;
    }
  
    const formatDate = (date: string): string => {
      if (date.length > 4)      return `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4)}`;
      else if (date.length > 2) return `${date.slice(0, 2)}/${date.slice(2)}`;

      return date;
    };
  
    if (value.length > 8) {
      const firstDate = value.slice(0, 8);
      const secondDate = value.slice(8);
      value = secondDate.length > 0 ? `${formatDate(firstDate)} - ${formatDate(secondDate)}` : formatDate(firstDate);
    }
    else {
      value = formatDate(value);
    }
  
    this.inputText = value;
    inputElement.value = value;
    this.parseInputDates();
  }
  
  /** Método que lê e salva as datas */
  public parseInputDates(): void {
    this.errorMessage = ''; 
    
    if (this.inputText.includes(' - ')) {
      const [startPart, endPart] = this.inputText.split(' - ');
      
      // Verifica se a data inicial é válida
      const startDate = this.parseDate(startPart); 
      let startValid = startDate !== null;
      
      // Verifica se a data final é válida
      const endDate = this.parseDate(endPart); 
      let endValid = endDate !== null;
      
      // Se ambas as datas forem válidas verifica e salva
      if (startValid && endValid) {
        this._startDate = startDate;
        this._endDate = endDate;
      
        if (this._startDate! > this._endDate!) { this.errorMessage = 'Data inicial não pode ser maior que a data final'; }
      }
      else if (startValid) {
        this._startDate = startDate;
      }
      else if (endValid) {
        this._endDate = endDate;
      }
    }
    // Se nenhuma data for válida, ambas permanecerão null no dado salvo e o erro será mostrado
    else {
      // Para o caso de uma única data
      const date = this.parseDate(this.inputText);
      if (date) {
        this._startDate = date;
        this._endDate = null;
        this._selecting = 'end';
      }
    }
  }

  private generateCalendarDays(): void {
    this.calendarDays = [];
    
    const firstDayOfMonth = new Date(this.currentYear, this._currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this._currentMonth + 1, 0);
    
    // Dias do mês anterior para preencher o início do calendário
    const firstDayOfWeek = firstDayOfMonth.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(this.currentYear, this._currentMonth, -i);
      this.calendarDays.push({
        date: day.getDate(),
        fullDate: new Date(day),
        otherMonth: true
      });
    }
    
    // Dias do mês atual
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      this.calendarDays.push({
        date: i,
        fullDate: new Date(this.currentYear, this._currentMonth, i),
        otherMonth: false
      });
    }
    
    // Dias do próximo mês para preencher o final do calendário
    const lastDayOfWeek = lastDayOfMonth.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      this.calendarDays.push({
        date: i,
        fullDate: new Date(this.currentYear, this._currentMonth + 1, i),
        otherMonth: true
      });
    }
  }

  private syncCalendarWithDates(): void {
    if (this._startDate) {
      this._currentMonth = this._startDate.getMonth();
      this.currentYear = this._startDate.getFullYear();
      this.generateCalendarDays();
    }

    if (this.inputText){
      this.parseInputDates()
    }
  }

  /** Método para converter string no formato DD/MM/AAAA para Date */
  private parseDate(dateStr: string): Date | null {    
    // Regex para validar formato DD/MM/AAAA
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = regex.exec(dateStr); // Modificado para qualidade do SonarQube
    
    if (!match) {
      if(dateStr.length > 0) this.errorMessage = 'Formato da data inválido';    
      return null;
    }
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; 
    const year = parseInt(match[3], 10);

    if (!this.validSingleDate(day, month, year)) {
      return null;
    }
    
    return new Date(year, month, day);
  }

  private validSingleDate(day: number, month: number, year: number): boolean {
    if (day < 1 || day > 31) {
      this.errorMessage = 'Por favor, informe um dia válido';
      return false;
    }
    
    if (month < 0 || month > 11) {
      this.errorMessage = 'Por favor, informe um mês válido.';
      return false;
    }
    
    if (year < 1900 || year > 2999) {
      this.errorMessage = 'Por favor, informe um ano válido';
      return false;
    }
    
    return true;
  }

  // ============ Metodos para os botões ============

  public toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.syncCalendarWithDates();
      this.generateCalendarDays();
      
      if (!this._startDate && !this._endDate) this._selecting = 'start';

      this.showYearSelector = false;
    }
  }

  /** Metódo que define qual data será atualizada quando selecionada de acordo com as datas já selecionadas */
  public selectDate(day: CalenderDay): void {
    const selectedDate = new Date(day.fullDate);

    // Case 1: Ambas as datas já estão selecionadas
    if (this._startDate && this._endDate) {
      // Se a data clicada for anterior à data inicial atual
      if (selectedDate < this._startDate) {
        this._startDate = selectedDate; // Atualiza só a data inicial
      }
      // Se a data clicada for posterior à data final atual
      else if (selectedDate > this._endDate) {
        this._endDate = selectedDate; // Atualiza só a data final
      }
      // Se a data clicada estiver entre as datas inicial e final
      else {
        // Calcula a diferença em dias para a data inicial e final
        const diffStart = Math.abs((selectedDate.getTime() - this._startDate.getTime()) / (1000 * 60 * 60 * 24));
        const diffEnd = Math.abs((this._endDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));

        // Atualiza a data mais próxima
        if (diffStart <= diffEnd) {
          this._startDate = selectedDate; // A data inicial está mais próxima
        }
        else {
          this._endDate = selectedDate; // A data final está mais próxima
        }
      }
    }
    // Case 2: Selecionando a data inicial
    else if (this._selecting === 'start') {
      this._startDate = selectedDate;
      this._selecting = 'end';
      
      // Se já existe uma data final e ela é anterior à nova data inicial,
      // limpa a data final
      if (this._endDate && this._endDate < this._startDate) {
        this._endDate = null;
      }
    }
    // Case 3: Selecionando a data final
    else {
      // Se a data selecionada for anterior à data inicial,
      // troca as datas
      if (selectedDate < this._startDate!) {
        this._endDate = this._startDate;
        this._startDate = selectedDate;
      }
      else {
        this._endDate = selectedDate;
      }

      this._selecting = 'start'; 
    }
    
    // Atualiza o texto de exibição após selecionar uma data no calendário
    this.updateInputText();
  }
  
  public prevMonth(): void {
    this._currentMonth--;
    
    if (this._currentMonth < 0) {
      this._currentMonth = 11;
      this.currentYear--;
    }

    this.generateCalendarDays();
  }
  
  public nextMonth(): void {
    this._currentMonth++;
    
    if (this._currentMonth > 11) {
      this._currentMonth = 0;
      this.currentYear++;
    }
    
    this.generateCalendarDays();
  }

  /** Métodos para o seletor de ano */
  public toggleYearSelector(): void {
    this.showYearSelector = !this.showYearSelector;
    
    if (this.showYearSelector) {
      this.yearSelectorStartYear = Math.floor(this.currentYear / 12) * 12;
      this.generateYearSelectorYears();
    }
  }
  
  private generateYearSelectorYears(): void {
    this.yearSelectorYears = [];
    
    for (let i = 0; i < 12; i++) {
      this.yearSelectorYears.push(this.yearSelectorStartYear + i);
    }
  }

  public prevYearPage(): void {
    this.yearSelectorStartYear -= 12;
    this.generateYearSelectorYears();
  }
  
  public nextYearPage(): void {
    this.yearSelectorStartYear += 12;
    this.generateYearSelectorYears();
  }
  
  public selectYear(year: number): void {
    this.currentYear = year;
    this.showYearSelector = false;
    this.generateCalendarDays();
  }

  public clearDates(): void {
    this._startDate = null;
    this._endDate = null;
    this._selecting = 'start';
    this.inputText = '';
    this.errorMessage = '';
    this.datesCleared.emit();
  }

  /** Finaliza seleção */
  public applySelection(): void {
    if (this._startDate && this._endDate) {
      this.dateRangeSelected.emit({
        startDate: this._startDate.toISOString(),
        endDate: this._endDate.toISOString()
      });

      this.showCalendar = false;
    }
    else if (this._startDate) {
      this.dateRangeSelected.emit({
        startDate: this._startDate.toISOString(),
        endDate: this._startDate.toISOString()
      }); 

      this._endDate = this._startDate;    
      this.updateInputText();
      this.showCalendar = false;
    }
    else{
      this.showCalendar = false;
    }
  }


  // ============ Metodos para a estilização ============

  public isSelected(day: CalenderDay): boolean {
    return this.isStartDate(day) || this.isEndDate(day);
  }

  public isStartDate(day: CalenderDay): boolean {
    return this._startDate != null && this.isSameDay(day.fullDate, this._startDate);
  }

  public isEndDate(day: CalenderDay): boolean {
    return this._endDate != null && this.isSameDay(day.fullDate, this._endDate);
  }

  public isInRange(day: CalenderDay): boolean {
    if (!this._startDate || !this._endDate) return false;
    return day.fullDate > this._startDate && day.fullDate < this._endDate;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate()
      && date1.getMonth() === date2.getMonth()
      && date1.getFullYear() === date2.getFullYear();
  }


  // ============ Métodos auxiliares ============

  /** Método para escutar o clique fora do modal */
  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.applySelection();
      this.showCalendar = false;
    }
  }

  /** Método para lidar com o evento de foco no input */
  public handleFocus(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement) inputElement.select();
  }

  /** Método para atualizar o texto do input */
  private updateInputText(): void {
    if (!this._startDate) {
      this.inputText = '';
      return;
    }
    
    const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');
    
    if (!this._endDate) this.inputText = formatDate(this._startDate);
    else this.inputText = `${formatDate(this._startDate)} - ${formatDate(this._endDate)}`;
  }

  // #endregion ==========> UTILS <==========

}
