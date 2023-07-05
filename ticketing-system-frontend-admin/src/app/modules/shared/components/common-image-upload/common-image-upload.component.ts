import { UtilsService } from '../../services/utils.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { Component, Inject, OnInit } from '@angular/core';


interface DialogData {
  dialog_title: string;
  width: number;
  height: number;
  aspectRatio: boolean;
  ratio: string;
}


@Component({
  selector: 'app-common-image-upload',
  templateUrl: './common-image-upload.component.html',
  styleUrls: ['./common-image-upload.component.scss']
})
export class CommonImageUploadComponent implements OnInit {
  uploadedFile;
  croppedImage;
  constructor(private dialogRef: MatDialogRef<CommonImageUploadComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private utilService: UtilsService) { }

  ngOnInit(): void {
  }

  /**
   * on file drop handler
   */
   onFileDropped(files: Array<any>) {
    if(!this.uploadedFile) {
      this.uploadedFile = files;
    }
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    if(!this.uploadedFile) {
      this.uploadedFile = files;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded(image: LoadedImage) {
      // show cropper
      console.log(image);

  }

  cropperReady() {
      // cropper ready
  }

  loadImageFailed() {
      // show message
  }

  closeDialog() {
    this.dialogRef.close({
      type: 'close'
    })
  }

  confirmFileUpload() {
    if (this.croppedImage) {
      let onlyBase64 = this.croppedImage.replace('data:image/png;base64,', '');
      let blob = this.utilService.b64toBlob(onlyBase64, 'image/png');
      // const blobUrl = URL.createObjectURL(blob);
      // window.open(blobUrl, '__blank');
      this.dialogRef.close({
        image_blob: blob,
        type: 'confirm',
        base64: this.croppedImage
      })
    }
  }

  backUpload() {
    this.uploadedFile = null;
    this.croppedImage = null;
  }

}
