import { Component, EventEmitter, signal } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { LibIconsComponent } from '../../lib-icons/lib-icons.component';


export type DataCropperDialog = {
  image: File;
  width: number;
  height: number;
}
export type ResultCropperDialog = {
  blob: Blob;
  imageUrl: string;
}

@Component({
  selector: 'app-dialog-cropper',
  imports: [ImageCropperComponent, LibIconsComponent],
  template: `
  <div class="p-2">
  <image-cropper
    [imageFile]="data.image"

    [maintainAspectRatio]="hasFixedSize"
    [aspectRatio]="aspectRatio"

    (imageCropped)="imageCropper($event)"
  ></image-cropper>
</div>

<hr>

<div class="d-flex flex-row-reverse gap-2 p-2 mb-2">
  <button class="btn btn-primary" (click)="resultHandler()">
    <lib-icon iconName="check" /> Cortar
  </button>
  <button class="btn btn-outline-secondary" (click)="cancel()">
    <lib-icon iconName="fechar" /> Cancelar
  </button>
</div>
    `,
  styles: ``,
  standalone: true
})
export class DialogCropperComponent {
  data!: DataCropperDialog;

  hasFixedSize = false;
  aspectRatio?: number;

  result = signal<ResultCropperDialog | undefined>(undefined);
  onClose = new EventEmitter<ResultCropperDialog>();

  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit() {
    if (this.data?.width && this.data?.height) {
      this.hasFixedSize = true;
      this.aspectRatio = this.data.width / this.data.height;
    }
  }

  imageCropper(event: ImageCroppedEvent) {
    const { blob, objectUrl } = event;

    if (blob && objectUrl) {
      this.result.set({ blob, imageUrl: objectUrl });
    }
  }

  resultHandler() {
    if (this.result()) {
      this.onClose.emit(this.result()!);
      this.bsModalRef.hide();
    }
  }

  cancel() {
    this.bsModalRef.hide();
  }

}
