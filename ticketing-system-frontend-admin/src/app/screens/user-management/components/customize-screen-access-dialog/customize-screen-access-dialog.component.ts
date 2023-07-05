import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from "lodash";


export interface DialogData {
  userFormGroup: FormGroup
}

@Component({
  selector: 'app-customize-screen-access-dialog',
  templateUrl: './customize-screen-access-dialog.component.html',
  styleUrls: ['./customize-screen-access-dialog.component.scss']
})
export class CustomizeScreenAccessDialogComponent implements OnInit {
  initialAccessControlData;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private matDialogRef: MatDialogRef<CustomizeScreenAccessDialogComponent>) { }

  ngOnInit(): void {
    this.initialAccessControlData = this.data.userFormGroup.get('access_control').value;
  }

  validate(control: FormGroup) {
    if (control.get('write_permission').value) {
      control.get('read_permission').setValue(true);
      control.get('read_permission').disable();
    } else {
      control.get('read_permission').enable();
    }
  }

  get controls() {
    return (this.data.userFormGroup.get('access_control') as FormArray).controls;
  }

  saveRoles() {
    this.matDialogRef.close();
  }

  closePopup() {
    this.resetAccessControlToOriginal();
    this.matDialogRef.close();
  }

  resetAccessControlToOriginal() {
    _.each(this.controls, (control: FormGroup) => {
      let present_in_role = control.get('present_in_role').value;
      if (!present_in_role) {
        let menu_id = control.get('menu_id').value;
        let menu_item = this.initialAccessControlData.find(menu => menu.menu_id == menu_id);
        control.get('read_permission').setValue(menu_item.read_permission);
        control.get('read_permission').enable();
        control.get('write_permission').setValue(menu_item.read_permission);
        control.get('write_permission').enable();
        control.updateValueAndValidity();
      }
    })
  }
}
