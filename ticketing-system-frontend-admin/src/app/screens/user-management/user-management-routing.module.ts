import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { UserManagementComponent } from './user-management.component';

const routes: Routes = [
  {path: '', component: UserManagementComponent},
  {path: 'add-user', component: AddUserComponent},
  {path: 'edit-user/:user_id', component: EditUserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
