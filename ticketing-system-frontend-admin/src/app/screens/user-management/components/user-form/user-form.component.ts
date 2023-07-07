import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';
import { LocationService } from 'src/app/modules/shared/services/location.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { RoleManagementService } from 'src/app/screens/role-management/services/role-management.service';
import { UserManagementService } from '../../services/user-management.service';
import { CustomizeScreenAccessDialogComponent } from '../customize-screen-access-dialog/customize-screen-access-dialog.component';
import { AuthService } from '../../../auth/service/auth.service';

import { Location } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnDestroy {
  @Input() formType = 'add';
  buttonLabel = 'Create New Member'
  userForm: FormGroup;
  roleList;
  usersList;
  usersListFilterControl: FormControl = new FormControl();
  activeRoles;
  initialAccessControlData;
  mandatory: any = { org: false, hosp: false };
  showHide: any = { org: false, hosp: false };
  formSubmitted = false;
  statusList = [
    { label: 'Active', value: '1' },
    { label: 'InActive', value: '0' },
  ];
  user_id;
  accessControlList;
  protected _onDestroy = new Subject();
  filteredUsersList;
  constructor(private utilService: UtilsService,
    private userService: UserManagementService,
    private encDecService: EncDecService,
    private dataService: DataService,
    private locationService: LocationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private roleManagementService: RoleManagementService,
    private authService: AuthService,
    public dialog: MatDialog,
    private _location: Location) {
  }

  async ngOnInit() {
    this.initForm();

    this.roleList = await this.userService.getActiveRoles().toPromise();

    if (this.formType === 'edit') {
      this.user_id = this.activatedRoute.snapshot.params.user_id;
      if (this.user_id) {
        try {
          this.user_id = parseInt(this.user_id)
        } catch (error) {
          this.user_id = null
        }
        if (!this.user_id) {
          this.backToGrid();
          return;
        }
      } else {
        this.backToGrid();
        return;
      }
      this.buttonLabel = 'Update Member';
      await this.getUserDetails();
      this.activeRoles = await this.userService.getRoles().toPromise();

    } else {
      this.activeRoles = await this.userService.getActiveRoles().toPromise();
    }

    this.userForm.get('role_id').valueChanges.subscribe(async(role_id) => {
      if (role_id) {
        this.setLocationValidatorsByRole(role_id);
        await this.getAccessControlList(role_id);
      }
    });
    this.buildRoleFormData();
    this.usersListFilterControl.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.filterUsers()
    })
  }

  ngOnDestroy(): void {
    this._onDestroy.next(null);
    this._onDestroy.complete();
  }

  filterUsers() {
    if (!this.usersList) {
      return;
    }

    let search = this.usersListFilterControl.value;
    if (!search) {
      this.filteredUsersList = this.usersList.slice();
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredUsersList = this.usersList.filter(user => user.display_name.toLowerCase().indexOf(search) > -1)
  }

  async getAccessControlList(role_id) {
    this.accessControlList = await this.authService.getAccessControlList(role_id).toPromise();
    let userAccessList;
    if (this.formType == 'edit') {
      userAccessList  = await this.userService.getUserAccessList(this.user_id).toPromise();
    }
    if (this.accessControlList) {
      let accessControlFormArray = (this.userForm.get('access_control') as FormArray).controls;
      _.each(accessControlFormArray, (control: FormGroup) => {
        let menu_id = control.get('menu_id').value;
        let accessControlMenu = this.accessControlList.find(menu => menu.menu_id == menu_id);
        if (accessControlMenu.read_permission == '1') {
          control.get('read_permission').setValue(true);
          control.get('read_permission').disable();
          control.get('present_in_role').setValue(true);
        }

        if (accessControlMenu.write_permission == '1') {
          control.get('write_permission').setValue(true);
          control.get('write_permission').disable();
          control.get('present_in_role').setValue(true);
        }
        control.updateValueAndValidity();
      })
    }

    if (userAccessList) {
      let accessControlFormArray = (this.userForm.get('access_control') as FormArray).controls;
      _.each(accessControlFormArray, (control: FormGroup) => {
        let menu_id = control.get('menu_id').value;
        let accessControlMenu = userAccessList.find(menu => menu.menu_id == menu_id);
        if (accessControlMenu.read_permission == '1') {
          control.get('read_permission').setValue(true);
          control.get('present_in_role').setValue(false);
        }

        if (accessControlMenu.write_permission == '1') {
          control.get('write_permission').setValue(true);
          control.get('present_in_role').setValue(false);
        }
        control.updateValueAndValidity();
      })
    }
    let formData = this.userForm.getRawValue();
    this.initialAccessControlData = formData.access_control;
  }

  buildRoleFormData() {
    forkJoin({
      menus: this.roleManagementService.getMenuList()
    }).subscribe(data => {
      // Role Menu build
      // if (this.formType == 'add') {
        _.each(data.menus, (menuItem) => {
          let formGroup = new FormGroup({
            menu_id: new FormControl(menuItem.menu_id),
            menu_name: new FormControl(menuItem.menu_name),
            read_permission: new FormControl(false, [Validators.required]),
            write_permission: new FormControl(false, [Validators.required]),
            present_in_role: new FormControl(false)
          });
          (this.userForm.get('access_control') as FormArray).push(formGroup);
        })
      // }
    })
  }

  async getUserDetails() {
    this.userService.getUserById(this.user_id).subscribe(async(res) => {
      this.userForm.patchValue({
        first_name: res.first_name,
        last_name: res.last_name,
        mobile_number: res.mobile_number,
        email_id: res?.email_id,
        role_id: res.role_id,
        is_active: ''+res.is_active
      });
      this.setLocationValidatorsByRole(res.role_id);
      await this.getAccessControlList(res.role_id);
      this.disableFields();
    })
  }

  disableFields() {
    this.userForm.disable();
    this.userForm.get('first_name').enable();
    this.userForm.get('last_name').enable();
    this.userForm.get('email_id').enable();
    this.userForm.get('is_active').enable();
    this.userForm.get('access_control').enable();
  }

  setLocationValidatorsByRole(role_id) {
    if (this.roleList) {
      const role = this.roleList.find(e => e.role_id === role_id);
      if (!role) { return; }
    }
  }


  initForm() {
    this.userForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      mobile_number: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/[6-9]{1}[0-9]{9}/)]),
      email_id: new FormControl('',),
      role_id: new FormControl('', [Validators.required]),
      is_active: new FormControl('1', [Validators.required]),
      access_control: new FormArray([])
    });
  }

  submit() {
    this.formSubmitted = true;
    if (this.userForm.valid) {
      let formData = this.userForm.getRawValue();

      let access_control = formData.access_control;
      _.each(this.initialAccessControlData, (data) => {
        let afterData = access_control.find(menu => menu.menu_id == data.menu_id);
        let changed = false;
        if (afterData.read_permission != data.read_permission) {
          changed = true;
        }

        if (afterData.write_permission != data.write_permission) {
          changed = true;
        }
        // let changed = Object.keys(data).some(key => afterData[key] != data)
        afterData.changed = changed;
      })
      let permissions = [];
      _.each(access_control, (access) => {
        if (!access.present_in_role) {
          if (access.changed) {
            if (access.write_permission) {
              permissions.push({menu_id: access.menu_id, per_id: 1});
            }

            if (access.read_permission) {
              permissions.push({menu_id: access.menu_id, per_id: 2});
            }
          }
        }
      });
      let permissionsChangedArray = access_control.map(menu => menu.changed);
      let user_permissions_updated = permissionsChangedArray.find(data => data == true) ? true : false;
      formData.user_module_json = permissions;
      formData.user_module_access = user_permissions_updated;

      delete formData.access_control;
      if (this.formType == 'add') {
        this.userService.createUser(formData).subscribe(res => {
          this.utilService.showSuccessToast('User created successfully');
          this.backToGrid();
        });

      } else {
        let userValue = this.userForm.getRawValue()
        this.userService.updateUser(this.user_id, formData).subscribe(res => {
          this.formSubmitted = false;
          this.utilService.showSuccessToast('User Updated Successfully');
          this.backToGrid();
        });
      }
    }
  }

  backToGrid() {
    // this.router.navigate(['/usermanagement']);
    this._location.back();
  }

  openCustomScreenAccessDialog() {
    const dialogRef = this.dialog.open(CustomizeScreenAccessDialogComponent,
      {
        data: {
          userFormGroup: this.userForm
        },
        width: '80%',
        height:'600px',
        disableClose: true,
        panelClass: 'my-dialog'
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let data = this.userForm.getRawValue();
      console.log(data);
    });
  }
}
