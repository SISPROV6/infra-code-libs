import { ChangeDetectorRef, Directive, EventEmitter, HostBinding, HostListener, inject, Input, Output } from '@angular/core';

@Directive({
  selector: '[libFileDrop]'
})
export class FileDropDirective {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);


  // ESTILIZAÇÃO DO CARD
  @HostBinding('style.border-color') private borderColor = '';
  @HostBinding('style.background-color') private background = '';
  @HostBinding('style.color') private color = 'var(--bs-primary)';
  @HostBinding('class.shake') private shake = false;
  
  // #endregion PRIVATE

  // #region PUBLIC
  
  /** Informa quais tipos de arquivo (MIME types) são permitidos para seleção.
   * 
   * @example
   * [ 'application/json', 'application/jpeg' ]
  */
  @Input() allowed: string[] = [];

  /** Informa se permite a seleção de múltiplos arquivos */
  @Input() multiple: boolean = false;
  
  /** Emite um evento quando um ou mais arquivos forem largados dentro da área do componente.
   * Contém os arquivos que foram jogados (com base nos tipos/extensões permitidas). */
  @Output() dropped = new EventEmitter<File | File[]>();

  /** Emite um evento quando o componente pai deve apresentar estado de erro ou não.
   * 
   * @example
   * true quando o usuário tentar arrastar um arquivo com formato não permitido para o card e após os 2s de delay ele emitirá novamente com false para resetar o status
  */
  @Output() error = new EventEmitter<boolean>();

  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> EVENTS <==========
  
  /**
   * Escuta os eventos de 'dragover' dentro da área do elemento com a diretiva.
   * Emite um sinal de Output() para alertar o componente quando o cursor entra no elemento enquanto arrasta algo
  */
  @HostListener('dragover', ['$event']) onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.borderColor = 'var(--bs-primary)';
    this.background = '#EEE';
    this.color = 'var(--bs-primary)'
  }

  /**
   * Escuta os eventos de 'dragleave' dentro da área do elemento com a diretiva.
   * Emite um sinal de Output() para alertar o componente quando o cursor sai de cima do elemento enquanto arrasta algo
  */
  @HostListener('dragleave', ['$event']) onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.borderColor = '';
    this.background = '';
    this.color = 'var(--bs-primary)'
  }


  /**
   * Executado quando o usuário larga o(s) arquivo(s) que está arrastando dentro da área do componente.
   * Valida se permite o upload de múltiplos arquivos e quais os tipos permitidos para enviar corretamente o(s) arquivo(s)
  */
  @HostListener('drop', ['$event']) onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Filtra os arquivos e mantém apenas os com extensão permitida (ou todos se nenhuma foi informada)
    const files = Array.from(e.dataTransfer?.files || []);
    const validFiles = this.filterValidFiles(files);

    if (validFiles && validFiles.length > 0) {
      if (this.multiple) this.dropped.emit(validFiles as File[]);
      else this.dropped.emit(validFiles[0] as File);
    }
    else {
      // Não há arquivos válidos na lista, deve exibir erro temporário
      this.showTemporaryError();
    }
  }

  // #endregion ==========> EVENTS <==========


  // #region ==========> UTILS <==========
  
  /** Filtra os arquivos que foram jogados e mantém apenas o(s) com extensões permitidas. */
  private filterValidFiles(files: File[]): File[] {
    const valid = files.filter(file => {
      return this.allowed.length === 0 || this.allowed.includes(file.type);
    });

    return valid;
  }

  /** Exibe uma mensagem de erro temporária e modifica o estilo do card para refletir o estado de erro temporário. */
  private showTemporaryError(): void {

    // Define o estilo de erro no card
    this.borderColor = 'var(--bs-danger) !important';
    this.background = 'var(--bs-danger-bg-subtle) !important';
    this.color = 'var(--bs-danger) !important';

    this.error.emit(true);
    this.shake = true;

    // Reseta as classes para o padrão após o erro sumir
    setTimeout(() => {
      this.borderColor = '';
      this.background = '';
      this.color = 'var(--bs-primary) !important';

      this.error.emit(false);
      this.shake = false;

      this._cdr.detectChanges();
    }, 2000);
  }

  // #endregion ==========> UTILS <==========

}
