import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomizeScreenAccessDialogComponent } from './components/customize-screen-access-dialog/customize-screen-access-dialog.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    AddUserComponent,
    EditUserComponent,
    UserFormComponent,
    CustomizeScreenAccessDialogComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserManagementModule { }
