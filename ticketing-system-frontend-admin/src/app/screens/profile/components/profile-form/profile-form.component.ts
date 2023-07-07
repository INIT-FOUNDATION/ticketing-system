import { MatDialog } from '@angular/material/dialog';

import { switchMap, of, forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';
import { ProfileService } from 'src/app/modules/shared/services/profile.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CommonService } from 'src/app/modules/shared/services/common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonImageUploadComponent } from 'src/app/modules/shared/components/common-image-upload/common-image-upload.component';
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  is_edit = false;
  profileForm: FormGroup;
  userInfo;
  signatures = {
    '/9j/4AAQS': 'image/jpg',
    '/9j/4Qxi': 'image/jpg',
    iVBORw0KGgo: 'image/png'
  };
  uploadedFileNameValidation = /^[ A-Za-z0-9_\-]*$/;
  ROLES = environment.ROLES;
  departmentList = [];
  languagesList: any;
  formSubmitted = false;
  constructor(private profileService: ProfileService,
    public dataService: DataService,
    private util: UtilsService,
    private encDecService: EncDecService,
    private commonService: CommonService,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initForm();
    this.buildData();
    this.getLoggedInUserData();
  }

  buildData() {
    forkJoin({
      logged_in_user: this.profileService.getLoggedInUserInfo()
    }).pipe(
      switchMap(res=> {
        this.setDetailsToProfileForm(res.logged_in_user);
        return of(null);
      })
    ).subscribe((res: any) => {
      console.log(res);
    })
  }

  getLoggedInUserData() {
    this.profileService.getLoggedInUserInfo().pipe(
      switchMap(res=> {
        this.setDetailsToProfileForm(res);
        return of(null);
      })
    ).subscribe((res: any) => {
      console.log(res);
    })
  }

  private setDetailsToProfileForm(res: any) {
    this.userInfo = res;
    this.profileForm.patchValue({
      first_name: this.userInfo.first_name,
      last_name: this.userInfo.last_name,
      mobile_number: this.userInfo.mobile_number,
      email_id: this.userInfo?.email_id,
      gender: this.userInfo.gender ? '' + this.userInfo.gender : null
    });

    if (this.userInfo.date_of_birth) {
      this.profileForm.get('date_of_birth').setValue(this.userInfo.date_of_birth);
    }
  }

  initForm() {
    this.profileForm = new FormGroup({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      date_of_birth: new FormControl(null, [Validators.required]),
      mobile_number: new FormControl({value: null, disabled: true}),
      email_id: new FormControl(null)
    })
  }

  submit() {
    this.profileForm.markAllAsTouched();
    this.profileForm.markAsDirty();
    this.formSubmitted = true;
    if (this.profileForm.valid) {
      let userData = this.profileForm.getRawValue();
      userData.date_of_birth = moment(userData.date_of_birth).format('YYYY-MM-DD');

      this.profileService.updateProfileDetails(this.userInfo.user_id, userData).subscribe(async (res) => {
        this.util.showSuccessToast('Profile Updated Successfully');
      });
    }
  }

  /*Profile Pic*/
  onSelectFile(event): void {

    if (event.target.files && event.target.files[0]) {
        const userid = (this.dataService.userDetails.user_id).toString();
        const userId = this.encDecService.set(userid);
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e: any) => {
          const mimeType = this.detectMimeType(reader.result);
          if (mimeType) {
            const name = event.target.files[0].name;
            const fileNameWithOutExtension = name.substring(0, name.lastIndexOf('.'));
            if (this.uploadedFileNameValidation.test(fileNameWithOutExtension)) {
              const formData = new FormData();
              formData.append('file',  event.target.files[0]);
              formData.append('userId',  userId);
              this.profileService.saveProfilePic(userId, formData)
              .subscribe(response => {
                const reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]); // read file as data url
                reader.onload = (e) => { // called once readAsDataURL is completed
                  this.dataService.setProfilePic(e.target.result);
                  this.util.showSuccessToast('Profile Picture Uploaded Successfully');
                };
              }, error => {
              if (error.status === 400){
                // this.util.showErrorToast(this.translate.instant('Format Not Supported'));
              } else {
                this.util.showErrorToast('Error In Profile Picture Upload');
              }});
            } else {
              event.target.files = null;
              this.util.showErrorToast(`Invalid file name`);
            }
          } else {
            event.target.files = null;
            this.util.showErrorToast('Invalid file type, allowed extensions are PNG,JPEG,JPG');
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

  navigateToHierarchy() {
    this.router.navigate([`/profile/hierarchy`])
  }

  dilodResponse;
  openImageUploadDialog() {
    const dialogRef = this.dialog.open(CommonImageUploadComponent, {
      data: {
        dialog_title: 'Profile Pic Upload',
        width: 300,
        height: 300,
        aspectRatio: true,
        ratio: 1 / 1
      },
      width: '40%',
      height:'520px',
      disableClose: true,
      panelClass: 'my-dialog'
    });

    dialogRef.afterClosed().pipe(
      switchMap((res: any) => {
        if (res.type == 'close') {
          return of(null);
        } else {
          const userid = (this.dataService.userDetails.user_id).toString();
          const userId = this.encDecService.set(userid);
          const formData = new FormData();
          this.dilodResponse = res;
          formData.append('file',  res.image_blob, 'profile_pic.png');
          formData.append('userId',  userId);
          return this.profileService.saveProfilePic(userId, formData);
        }
      })
    ).subscribe(async(response) => {
      if (response) {
        await this.commonService.getUserDetailsAfterProfileUpdate();
        const reader = new FileReader();
        reader.readAsDataURL(this.dilodResponse.image_blob); // read file as data url
        reader.onload = (e) => { // called once readAsDataURL is completed
          this.dataService.setProfilePic(e.target.result);
          this.util.showSuccessToast('Profile Picture Uploaded Successfully');
        };
      }
    }, error => {
    if (error.status === 400){
      // this.util.showErrorToast(this.translate.instant('Format Not Supported'));
    } else {
      this.util.showErrorToast('Error In Profile Picture Upload');
    }});
  }


  dilodResponseSignature;
  openImageUploadDialogForSignature() {
    const dialogRef = this.dialog.open(CommonImageUploadComponent, {
      data: {
        dialog_title: 'Signature Upload',
        width: 250,
        height: 80,
        aspectRatio: true,
        ratio: 3 / 1
      },
      width: '40%',
      height:'520px',
      disableClose: true,
      panelClass: 'my-dialog'
    });

    dialogRef.afterClosed().pipe(
      switchMap((res: any) => {
        if (res.type == 'close') {
          return of(null);
        } else {
          const userid = (this.dataService.userDetails.user_id).toString();
          const userId = this.encDecService.set(userid);
          const formData = new FormData();
          this.dilodResponse = res;
          formData.append('file',  res.image_blob, 'profile_pic.png');
          formData.append('userId',  userId);
          return this.profileService.savesignaturePic(formData);
        }
      })
    ).subscribe(async(response) => {
      if (response) {
        await this.commonService.getUserDetailsAfterProfileUpdate();
        const reader = new FileReader();
        reader.readAsDataURL(this.dilodResponse.image_blob); // read file as data url
        reader.onload = (e) => { // called once readAsDataURL is completed
          this.dataService.setSignaturePic(e.target.result);
          this.util.showSuccessToast('Signature Uploaded Successfully');
        };
      }
    }, error => {
    if (error.status === 400){
      // this.util.showErrorToast(this.translate.instant('Format Not Supported'));
    } else {
      this.util.showErrorToast('Error In Profile Picture Upload');
    }});
  }

}
