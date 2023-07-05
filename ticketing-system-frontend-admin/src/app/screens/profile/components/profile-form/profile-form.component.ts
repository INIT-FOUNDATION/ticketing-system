import { MatDialog } from '@angular/material/dialog';

import { switchMap, of, forkJoin } from 'rxjs';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';
import { LocationService } from 'src/app/modules/shared/services/location.service';
import { ProfileService } from 'src/app/modules/shared/services/profile.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { AuthService } from 'src/app/screens/auth/service/auth.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CommonService } from 'src/app/modules/shared/services/common.service';
import { Route, Router } from '@angular/router';
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
  showHide = { state: false, district: false, block: false, village: false , hosp: false, org: false };
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
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private encDecService: EncDecService,
    private locationService: LocationService,
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
      logged_in_user: this.profileService.getLoggedInUserInfo(),
      languages: this.profileService.getAllLanguages()
    }).pipe(
      switchMap(res=> {
        this.setDetailsToProfileForm(res.logged_in_user);
        this.languagesList = res.languages;
        // if (this.ROLES.DOCTOR == this.userInfo.name) {
        //   return this.hospitalManagementService.getDeptHospMappingGrid({hospital_id: this.userInfo.hosp_id})
        // }
        return of(null);
      })
    ).subscribe((res: any) => {
      if (res) {
        this.departmentList = res.data;
      }
    })
  }

  getLoggedInUserData() {
    this.profileService.getLoggedInUserInfo().pipe(
      switchMap(res=> {
        this.setDetailsToProfileForm(res);
        // if (this.ROLES.DOCTOR == this.userInfo.name) {
        //   return this.hospitalManagementService.getDeptHospMappingGrid({hospital_id: this.userInfo.hosp_id})
        // }
        return of(null);
      })
    ).subscribe((res: any) => {
      if (res) {
        this.departmentList = res.data;
      }
    })
  }

  private setDetailsToProfileForm(res: any) {
    this.userInfo = res;
    this.profileForm.patchValue({
      first_name: this.userInfo.first_name,
      last_name: this.userInfo.last_name,
      mobile_number: this.userInfo.mobile_number,
      state_id: this.userInfo.state_id,
      district_id: this.userInfo.district_id,
      block_id: this.userInfo.block_id,
      village_id: this.userInfo.village_id,
      hosp_id: this.userInfo.hosp_id,
      org_id: this.userInfo.org_id,
      email_id: this.userInfo?.email_id,
      gender: this.userInfo.gender ? '' + this.userInfo.gender : null,
      experience: this.userInfo.experience,
      price_of_consultation: this.userInfo.price_of_consultation,
      education_degree: this.userInfo.education_degree,
      about_me: this.userInfo.about_me,
      medical_registration_no: this.userInfo.medical_registration_no,
      preferred_state_id: this.userInfo.preferred_state_id,
      preferred_district_id: this.userInfo.preferred_district_id,
      preferred_zipcode: this.userInfo.preferred_zipcode,
    });


    if (this.ROLES.DOCTOR == this.userInfo.name) {
      this.profileForm.get('department_ids').setValidators([Validators.required]);
      this.profileForm.get('experience').setValidators([Validators.required]);
      this.profileForm.get('price_of_consultation').setValidators([Validators.required]);
      this.profileForm.get('education_degree').setValidators([Validators.required]);
      this.profileForm.get('about_me').setValidators([Validators.required]);
      this.profileForm.get('medical_registration_no').setValidators([Validators.required]);
      this.profileForm.get('language_ids').setValidators([Validators.required]);
      let specIds = this.userInfo.hosp_dept_id.map(data => data.hosp_dept_id);
      if (specIds && specIds.length > 0) {
        this.userInfo['specIds'] = specIds;
        this.profileForm.get('department_ids').setValue(specIds);
      }

      let langIds = this.userInfo.language_ids?.map(data => data.language_id);
      if (langIds && langIds.length > 0) {
        this.userInfo['langIds'] = langIds;
        this.profileForm.get('language_ids').setValue(langIds);
      }
    }

    if (this.userInfo.date_of_birth) {
      this.profileForm.get('date_of_birth').setValue(this.userInfo.date_of_birth);
    }


    if (this.userInfo.preferred_state_id) {
      this.getStates();
    }

    if (this.userInfo.preferred_district_id) {
      this.onStateChangeDr(false);
    }

    if (this.userInfo.preferred_zipcode) {
      this.onDistrictChangeDr(false);
    }

    if (this.userInfo.district_id) {
      this.showHide.district = true;
      this.onStateChange();
    }

    if (this.userInfo.state_id) {
      this.showHide.state = true;
      this.getStates();
    }

    if (this.userInfo.district_id) {
      this.showHide.district = true;
      this.onStateChange();
    }

    if (this.userInfo.block_id) {
      this.showHide.block = true;
      this.onDistrictChange();
    }

    if (this.userInfo.village_id) {
      this.showHide.village = true;
      this.onBlockChange();
    }

    if (this.userInfo.org_id) {
      this.showHide.org = false;
      this.getOrganizationsList();
    }

    if (!this.userInfo.patient_id) {

      if (this.userInfo.hosp_id) {
        this.showHide.hosp = false;
      }
    }
  }

  initForm() {
    this.profileForm = new FormGroup({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      date_of_birth: new FormControl(null, [Validators.required]),
      mobile_number: new FormControl({value: null, disabled: true}),
      state_id: new FormControl({value: null, disabled: true}),
      district_id: new FormControl({value: null, disabled: true}),
      block_id: new FormControl({value: null, disabled: true}),
      village_id: new FormControl({value: null, disabled: true}),
      hosp_id: new FormControl({value: null, disabled: true}),
      org_id: new FormControl({value: null, disabled: true}),
      email_id: new FormControl(null),
      department_ids: new FormControl(null),
      language_ids: new FormControl(null),
      experience: new FormControl(null),
      price_of_consultation: new FormControl(null),
      education_degree: new FormControl(null),
      about_me: new FormControl(null),
      medical_registration_no: new FormControl(null),
      preferred_state_id: new FormControl(null),
      preferred_district_id: new FormControl(null),
      preferred_zipcode: new FormControl(null),
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
        setTimeout(async()=>{
          this.userInfo = await this.commonService.getUserDetailsAfterProfileUpdate();
          let specIds = this.userInfo.hosp_dept_id.map(data => data.hosp_dept_id);
          if (specIds && specIds.length > 0) {
            this.userInfo['specIds'] = specIds;
            this.profileForm.get('department_ids').setValue(specIds);
          }

          let langIds = this.userInfo.language_ids.map(data => data.language_id);
          if (langIds && langIds.length > 0) {
            this.userInfo['langIds'] = langIds;
            this.profileForm.get('language_ids').setValue(langIds);
          }
          this.util.showSuccessToast('Profile Updated Successfully');
        },100)
      });
    }
  }

  organizationList;
  getOrganizationsList() {
    this.locationService.getOrganization().subscribe(res => {
      this.organizationList = res;
    });
  }

  stateList;
  getStates() {
    this.locationService.getStates().subscribe(res => {
      this.stateList = res;
    });
  }

  districtList;
  onStateChange() {
   let state_id = this.profileForm.get('state_id').value;
   if(state_id) {
    this.locationService.getDistricts(state_id).subscribe(res => {
      this.districtList = res;
    })
   }
  }

  onStateChangeDr(makenull = true) {
   let state_id = this.profileForm.get('preferred_state_id').value;
   if (makenull) {
    this.profileForm.get('preferred_district_id').setValue(null);
    this.profileForm.get('preferred_zipcode').setValue(null);
   }
   if(state_id) {
    this.locationService.getDistricts(state_id).subscribe(res => {
      this.districtList = res;
    })
   }
  }

  blockList;
  onDistrictChange() {
    let state_id = this.profileForm.get('state_id').value;
    let district_id = this.profileForm.get('district_id').value;
    if(state_id && district_id) {

      this.locationService.getBlocks(district_id).subscribe(res => {
        this.blockList = res;
      });

    }
  }

  pincodesList;
  onDistrictChangeDr(makenull = true) {
    let state_id = this.profileForm.get('preferred_state_id').value;
    let district_id = this.profileForm.get('preferred_district_id').value;
    if(state_id && district_id) {
      this.pincodesList = [];
      if (makenull) {
        this.profileForm.get('preferred_zipcode').setValue(null);
      }
      this.locationService.getPincodes(district_id).subscribe(res => {
        this.pincodesList = res;
      });

    }
  }

  villageList;
  onBlockChange() {
    let state_id = this.profileForm.get('state_id').value;
    let district_id = this.profileForm.get('district_id').value;
    let block_id = this.profileForm.get('block_id').value;
    if(state_id && district_id && block_id) {
      this.locationService.getVillages(block_id).subscribe(res => {
        this.villageList = res;
      });

    }
  }

  onVillageChange() {
    let state_id = this.profileForm.get('state_id').value;
    let district_id = this.profileForm.get('district_id').value;
    let block_id = this.profileForm.get('block_id').value;
    let village_id = this.profileForm.get('village_id').value;
    if(state_id && district_id && block_id && village_id) {
    }
  }

  hospitalList;
  

  get isHierarchySectionNecessary() {
    let returnValue = false;
    _.each(this.showHide, (value,key) => {
      if (this.showHide[key]) {
        returnValue = true;
        return false;
      }
    })
    return returnValue;
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
