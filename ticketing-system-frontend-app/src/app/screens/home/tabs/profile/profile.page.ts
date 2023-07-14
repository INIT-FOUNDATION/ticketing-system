import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  NavController,
  Platform,
} from '@ionic/angular';
import { AuthService } from 'src/app/screens/auth/services/auth.service';
import { ProfileService } from './services/profile.service';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ToastrService } from 'src/app/modules/shared/services/toastr.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  patientProfileDetails;
  croppedImagePath = '';
  isLoading = false;
  isModalOpen = false;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50,
  };

  signatures = {
    '/9j/4AAQS': 'image/jpg',
    '/9j/4Qxi': 'image/jpg',
    iVBORw0KGgo: 'image/png',
  };
  uploadedFileNameValidation = /^[ A-Za-z0-9_\-]*$/;
  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private navController: NavController,
    public profileService: ProfileService,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private platform: Platform,
    private toastrService: ToastrService,
    public utilityService: UtilityService,
    private navControl: NavController,
    private androidPermissions: AndroidPermissions
  ) {}

  ngOnInit() {}

  notificationSettings() {
    this.navControl.navigateRoot([`/home/profile/notification-settings`]);
  }

  planManagement() {
    this.navControl.navigateRoot([`/home/profile/plan-management`]);
  }

  base64Image;
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
      this.androidPermissions
        .checkPermission(
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
        )
        .then(async (result) => {
          if (result.hasPermission) {
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
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
            );
          }
        });
    } else {
      uploadFile.click();
    }
  }

  /*Profile Pic*/
  uploadedFile;
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

  ionViewWillEnter() {

  }

  openProfileSettings() {
    this.navController.navigateRoot(['/home/profile/profile-form']);
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

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.authService.signOut();
          },
        },
      ],
    });

    await alert.present();
  }
}
