import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrService } from 'ngx-toastr';

import { FileDropDirective } from '../../directives/file-drop.directive';
import { FileUtils } from '../../utils/file-utils';
import { LibIconsComponent } from "../lib-icons/lib-icons.component";

@Component({
  selector: 'lib-file-upload',
  imports: [
    LibIconsComponent,
    FileDropDirective,
    TooltipModule,
  ],
  templateUrl: './lib-file-upload.component.html',
  styles: `
    #upload-card {
      border-style: dashed;
      transition: all .2s ease;

      &:hover {
        background-color: #EEEEEE;
        border-color: var(--bs-primary);
      }
    }


    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-3px); }
      80% { transform: translateX(3px); }
    }

    .shake { animation: shake 0.4s ease; }
  `
})
export class LibFileUploadComponent {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _toastr: ToastrService = inject(ToastrService);
  // #endregion PRIVATE

  // #region PUBLIC
  
  /** Informa quais tipos de arquivo (MIME types) são permitidos para seleção.
   * 
   * @example
   * [ 'application/json', 'application/jpeg' ]
   * 
   * @default
   * [ 'image/*', 'application/*', 'text/*' ]
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types Para consultar os MIME types mais comuns
  */
  @Input() allowed: string[] = [ 'image/*', 'application/*', 'text/*' ];

  /** Informa se permite a seleção de múltiplos arquivos. */
  @Input() multiple: boolean = false;

  /** Permite informar um arquivo de forma externa ao componente. */
  @Input('file') public activeFile?: File | null;

  /** Emite um evento quando um arquivo for selecionado de forma interna pelo componente ou quando o componente ativo for excluído. */
  @Output() public fileChange = new EventEmitter<File | null>();

  /** Emite um evento quando o usuário clica para confirmar o upload */
  @Output() public confirmUpload = new EventEmitter<void>();


  protected uploadError: boolean = false;
  protected cursorStatus: 'over' | 'leave' = 'leave';

  protected get FileUtils(): typeof FileUtils { return FileUtils; }
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> UTILS <==========

  /** 
   * Recebe um arquivo que foi selecionado manualmente da máquina do usuário.
   * 
   * @param e Evento de change que contém o arquivo que foi selecionado
  */
  protected receiveFile(e: Event) {
    try {
      const inputElement = e.target as HTMLInputElement;

      if (inputElement.files && inputElement.files.length > 0) {
        const selectedFile = inputElement.files[0];

        this.activeFile = selectedFile;
        this.fileChange.emit(this.activeFile);
      }
    }
    catch (err) {
      this._toastr.error("Ocorreu um erro ao selecionar o arquivo da sua máquina.");
    }
  }

  /**
   * Lê e recebe um ou mais arquivos que foram largados na área do componente com um 'drag and drop' da máquina do usuário.
   * 
   * @param file Arquivo(s) que foi(ram) largados dentro da área do componente
  */
  public dropFile(file: File | File[]) {
    const f = file as File;
    
    try {
      this.activeFile = f;
      this.fileChange.emit(this.activeFile);
    }
    catch (err) {
      this._toastr.error("Ocorreu um erro ao selecionar o arquivo da sua máquina.");
    }
  }

  // #endregion ==========> UTILS <==========

}
