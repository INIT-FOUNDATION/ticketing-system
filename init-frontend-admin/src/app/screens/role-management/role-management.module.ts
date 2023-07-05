import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleManagementRoutingModule } from './role-management-routing.module';
import { RoleManagementComponent } from './role-management.component';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RoleManagementComponent,
    AddRoleComponent,
    EditRoleComponent,
    RoleFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RoleManagementRoutingModule,
    SharedModule
  ]
})
export class RoleManagementModule { }
