import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { ProfileService } from '../../services/profile.service';
import { ToastrService } from 'src/app/modules/shared/services/toastr.service';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.page.html',
  styleUrls: ['./profile-form.page.scss'],
})
export class ProfileFormPage implements OnInit {
  constructor(
    private router: Router,
    private profileService: ProfileService,
    public utilityService: UtilityService,
    private toastrService: ToastrService,
    private platform: Platform,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
  ) {}
  patientSummaryDetails: any = [];
  isSummaryDetailsOpen: boolean = false;
  assignedTo: any;
  assignedAs: any;
  patientDetailsArray: any = [];
  uploadedFile: any;
  isModalOpen: boolean = false;
  base64Image: any;
  signatures = {
    '/9j/4AAQS': 'image/jpg',
    '/9j/4Qxi': 'image/jpg',
    iVBORw0KGgo: 'image/png',
  };
  ngOnInit() {
    this.getProfileDetails();
  }

  getProfileDetails() {
    // this.profileService.getPatientProfile().subscribe((res) => {
    //   this.getPatientSummaryDetails();
    // });
  }

  ionViewWillEnter() {
    // this.profileService
    //   .getPatientProfile()
    //   .pipe(
    //     switchMap((res: any) => {
    //       this.patientDetailsArray = res;

    //       if (res.profile_pic) {
    //         return this.profileService.getProfilePic();
    //       } else {
    //         return of(null);
    //       }
    //     })
    //   )
    //   .subscribe((res: any) => {});
  }

  back() {
    this.router.navigate(['/home/profile']);
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 40,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        let base64 = imageData;
        this.base64Image = `data:image/jpeg;base64,${base64}`;
        const blobData = this.b64toBlob(base64, `image/jpeg`);
        const imageName = new Date().getTime().toString();
        let file = new File([blobData], imageName);
        this.uploadedFile = [file];
        this.isModalOpen = true;
      },
      (err) => {
        // Handle error
      }
    );
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  async selectImage(uploadFile: HTMLInputElement) {
    let isMobile = this.platform.is('cordova');
    if (isMobile) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Select Image source',
        buttons: [
          {
            text: 'Load from Library',
            handler: () => {
              this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
            },
          },
          {
            text: 'Use Camera',
            handler: () => {
              this.pickImage(this.camera.PictureSourceType.CAMERA);
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      });
      await actionSheet.present();
    } else {
      uploadFile.click();
    }
  }

  onSelectFile(event): void {
    if (event.target.files && event.target.files[0]) {
      this.uploadedFile = event.target.files;
      const reader = this.profileService.getFileReader();
      this.isModalOpen = true;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        const mimeType = this.detectMimeType(reader.result);
        if (mimeType) {
          const name = event.target.files[0].name;
          const fileNameWithOutExtension = name.substring(
            0,
            name.lastIndexOf('.')
          );
        } else {
          event.target.files = null;
          this.toastrService.presentSuccessToast(
            'bottom',
            'Invalid file type, allowed extensions are PNG,JPEG,JPG'
          );
        }
      };
    }
  }

  detectMimeType(b64) {
    for (const s in this.signatures) {
      if (b64.indexOf(s) > 0) {
        return this.signatures[s];
      }
    }
  }

  confirmCropping() {
    this.isModalOpen = false;
    let onlyBase64 = this.croppedImage.replace('data:image/png;base64,', '');
    let blob = this.b64toBlob(onlyBase64, 'image/png');
    const formData = new FormData();
    formData.append('file', blob, 'profile_pic.png');

    // this.profileService.saveProfilePic(formData).subscribe(
    //   (response) => {
    //     const reader = this.profileService.getFileReader();
    //     reader.readAsDataURL(blob); // read file as data url
    //     reader.onload = (e) => {
    //       // called once readAsDataURL is completed
    //       this.profileService.setProfilePic(e.target.result);
    //       this.toastrService.presentSuccessToast(
    //         'bottom',
    //         'Profile Picture Uploaded Successfully'
    //       );
    //     };
    //   },
    //   (error) => {
    //     if (error.status === 400) {
    //       // this.util.showErrorToast(this.translate.instant('Format Not Supported'));
    //     } else {
    //       this.toastrService.presentSuccessToast(
    //         'bottom',
    //         'Error In Profile Picture Upload'
    //       );
    //     }
    //   }
    // );
  }

  closeCropping() {
    this.isModalOpen = false;
  }

  croppedImage;
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }


  setOpen(isOpen: boolean, value) {
    this.assignedAs = value;
    if (value == 'Psychiatrist') {
      this.assignedTo =
        this.patientSummaryDetails?.patient_rpp_psychiatrist_assignment;
    } else if (value == 'Psychologist') {
      this.assignedTo =
        this.patientSummaryDetails?.patient_rpp_psychologist_assignment;
    } else if (value == ' Counselor') {
      this.assignedTo =
        this.patientSummaryDetails?.patient_rpp_counsellor_assignment;
    } else if (value == 'Diagnosis') {
      this.assignedTo = this.patientSummaryDetails?.provisionaldiagnosisandcode;
    }
    this.isSummaryDetailsOpen = isOpen;
  }
}
