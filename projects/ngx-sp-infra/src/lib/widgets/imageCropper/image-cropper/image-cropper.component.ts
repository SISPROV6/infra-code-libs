import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { filter } from 'rxjs';
import { ModalUtilsService } from '../../../service/modal-utils.service';
import { DialogCropperComponent, ResultCropperDialog } from '../dialog-cropper/dialog-cropper.component';

@Component({
  selector: 'app-image-cropper',
  imports: [CommonModule],
  template: `
   <input #inputField type="file" hidden (change)="fileSelected($event)" accept="image/*" (click)="inputField.value = ''"/>
  `,
  styles: ``,
  standalone: true
})
export class ImageCropperComponent {

  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;
  @Output() imageOut = new EventEmitter<File>();
  
  imageWidth = signal(0);
  imageHeight = signal(0);
  
  @Input() set width(val: number) {
    this.imageWidth.set(val);
  };
  @Input() set height(val: number) {
    this.imageHeight.set(val);
  };
  
  cropperImage = signal<ResultCropperDialog | undefined>(undefined)
  dialog: ModalUtilsService = inject(ModalUtilsService);

  openFileDialog(){
    this.inputField.nativeElement.click();
  }  
  
  fileSelected(event: any) {
    const file = event.target.files[0];
    if(file) {
      const dialogRef = this.dialog.openInitialStateModal(DialogCropperComponent, 1, {
        data: { image: file, width: this.imageWidth(), height: this.imageHeight() }
      }, "modal-dialog-centered modal-xl"
    );

      const instance = dialogRef?.content as DialogCropperComponent;
      instance.onClose.pipe(filter(Boolean)).subscribe(
        result => { 
          this.cropperImage.set(result);
          const file = new File([result.blob], 'imagem-cortada.png', { type: result.blob.type });
          this.imageOut.emit(file);
        }
      );
    }
  }
}
