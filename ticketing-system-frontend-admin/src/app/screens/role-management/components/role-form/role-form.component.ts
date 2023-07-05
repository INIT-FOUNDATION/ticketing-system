import { Component, Input, OnInit } from '@angular/core';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';
import { RoleManagementService } from '../../services/role-management.service';
import * as  _ from 'lodash';
import { forkJoin } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/screens/auth/service/auth.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {
  @Input() formType = 'add';
  @Input() roleDetails = null;
  formSubmitted = false;
  header = 'Create Role';
  levelsList: any[] = [];
  roleForm: FormGroup;
  role_id;
  statusList = [
    {label: 'Active', value: '1'},
    {label: 'InActive', value: '0'}
  ]
  constructor(private pageHeaderService: PageHeaderService,
              private roleManagementService: RoleManagementService,
              private utilService: UtilsService,
              private router: Router,
              private authService: AuthService,
              private activeRoute: ActivatedRoute,
              private dataService: DataService) {
  }

  getRoleDetails() {
    return forkJoin({
      role_details: this.roleManagementService.getSpecificRole(this.role_id),
      role_modules: this.authService.getAccessControlList(this.role_id)
    })
  }

  async ngOnInit() {
    this.initForm();
    if (this.formType == 'edit') {
      this.role_id = this.activeRoute.snapshot.params.role_id;
      if (!this.role_id) {
        this.router.navigate(['/rolemanagement']);
        return;
      }
      let roleData = await this.getRoleDetails().toPromise();
      this.roleDetails = roleData.role_details;
      this.roleDetails.moduleJson = roleData.role_modules;
      this.roleForm.patchValue({
        role_name: this.roleDetails.role_name,
        level: this.roleDetails.level,
        is_active: ''+this.roleDetails.is_active,
        role_description: this.roleDetails.role_description
      });
      if (this.roleDetails.is_active == '0') {
        this.roleForm.disable();
        this.roleForm.get('is_active').enable();
      }

      _.each(this.roleDetails.moduleJson, (menuItem) => {
        let readPermission = menuItem.read_permission == '1' ? true : false;
        let writePermission = menuItem.write_permission == '1' ? true : false;
        let disableChkbx = writePermission ? true : false;
        if (this.dataService.userDetails.hierarchy == 'GOVT') {
          if (menuItem.menu_name == 'Organization Management') return;
        }
        let formGroup = new FormGroup({
          menu_id: new FormControl(menuItem.menu_id),
          menu_name: new FormControl(menuItem.menu_name),
          read_permission: new FormControl({value:readPermission, disabled: disableChkbx}, [Validators.required]),
          write_permission: new FormControl(writePermission, [Validators.required])
        });
        (this.roleForm.get('access_control') as FormArray).push(formGroup);
      });
    }
    this.buildFormData();
  }

  initForm() {
    this.roleForm = new FormGroup({
      role_name: new FormControl(null, [Validators.required]),
      level: new FormControl(null, [Validators.required]),
      is_active: new FormControl("1", [Validators.required]),
      role_description: new FormControl(null, [Validators.required]),
      access_control: new FormArray([])
    });
  }

  buildFormData() {
    forkJoin({
      levels: this.roleManagementService.getLevels(),
      menus: this.roleManagementService.getMenuList()
    }).subscribe(data => {
      // Levels List
      _.each(data.levels, (level) => {
        this.levelsList.push({label: level, value: level});
      });

      // Role Menu build
      if (this.formType == 'add') {
        _.each(data.menus, (menuItem) => {
          if (this.dataService.userDetails.hierarchy == 'GOVT') {
            if (menuItem.menu_name == 'Organization Management') return;
          }
          let formGroup = new FormGroup({
            menu_id: new FormControl(menuItem.menu_id),
            menu_name: new FormControl(menuItem.menu_name),
            read_permission: new FormControl(false, [Validators.required]),
            write_permission: new FormControl(false, [Validators.required])
          });
          (this.roleForm.get('access_control') as FormArray).push(formGroup);
        })
      }
    })
  }

  submit() {
    this.roleForm.markAllAsTouched();
    this.formSubmitted = true;
    if (!this.roleForm.valid) { return; }


    if (this.roleForm.valid) {
      let formData = this.roleForm.getRawValue();

      let access_control = formData.access_control;
      let permissions = [];
      _.each(access_control, (access) => {
        if (access.write_permission) {
          permissions.push({menu_id: access.menu_id, per_id: 1});
        }

        if (access.read_permission) {
          permissions.push({menu_id: access.menu_id, per_id: 2});
        }
      });
      if (permissions.length > 0) {
        formData.module_json = permissions;
      } else {
        this.utilService.showErrorToast('Please choose permissions');
        return;
      }

      if (this.formType == 'add') {
        this.roleManagementService.addRole(formData).subscribe((res)=> {
          this.utilService.showSuccessToast('Role details saved successfully');
          this.backToRoleGrid();
        })
      } else {
        formData.role_id = this.role_id;
        this.roleManagementService.updateRoleDetailsRequest(formData).subscribe((res)=> {
          this.utilService.showSuccessToast('Role details updated successfully');
          this.backToRoleGrid();
        })
      }
    }
  }

  get controls() {
    return (this.roleForm.get('access_control') as FormArray).controls;
  }

  validate(control: FormGroup) {
    if (control.get('write_permission').value) {
      control.get('read_permission').setValue(true);
      control.get('read_permission').disable();
    } else {
      control.get('read_permission').enable();
    }
  }

  backToRoleGrid() {
    this.router.navigate(['/rolemanagement']);
    return;
  }
}
