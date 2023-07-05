import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordPolicyComponent } from './password-policy.component';

const routes: Routes = [
  {path: '', component: PasswordPolicyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordPolicyRoutingModule { }
