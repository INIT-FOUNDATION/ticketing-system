import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';

export interface DialogData {
}

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {
  uploadedFile: any;
  uploadDocumentForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
  private matDialogRef: MatDialogRef<UploadDocumentComponent>,
  private utilService: UtilsService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.uploadDocumentForm = new FormGroup({
      file_name: new FormControl(null, [Validators.required]),
      document: new FormControl(null),
    })
  }

  submitDocument() {
    if (this.uploadDocumentForm.valid && this.uploadedFile) {
      let data = this.uploadDocumentForm.getRawValue();
      const formData = new FormData();
      formData.append('file_name', data.file_name);
      formData.append('file', this.uploadedFile);
      console.log(formData);
      this.closePopup(formData);
      // this.appointmentService.uploadPatientDocument(formData).subscribe(res => {
      //   this.utilService.showSuccessToast('Document uploaded successfully');
      //   this.closePopup(true)
      // })
    }
  }

  /**
   * on file drop handler
   */
   onFileDropped($event) {
    if(!this.uploadedFile) {
      this.prepareFilesList($event);
    }
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    if(!this.uploadedFile) {
      this.prepareFilesList(files);
    }
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.uploadedFile.progress == 100) {
      this.uploadedFile = null;
      this.uploadDocumentForm.get('document').setValue(null);
    }
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      const progressInterval = setInterval(() => {
        if (this.uploadedFile.progress === 100) {
          clearInterval(progressInterval);
          // this.uploadFilesSimulator(index + 1);
        } else {
          this.uploadedFile.progress += 5;
        }
      }, 200);
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.uploadedFile = item;
      // this.uploadDocumentForm.get('document').setValue(item.name);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  closePopup(savedData?) {
    this.matDialogRef.close({savedData});
  }

}
