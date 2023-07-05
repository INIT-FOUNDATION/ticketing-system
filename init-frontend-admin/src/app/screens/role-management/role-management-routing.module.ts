import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { RoleManagementComponent } from './role-management.component';

const routes: Routes = [
  {path: '', component: RoleManagementComponent},
  {path: 'add-role', component: AddRoleComponent},
  {path: 'edit-role/:role_id', component: EditRoleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleManagementRoutingModule { }
