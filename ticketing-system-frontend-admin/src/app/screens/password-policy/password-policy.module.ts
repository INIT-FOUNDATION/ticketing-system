import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordPolicyRoutingModule } from './password-policy-routing.module';
import { PasswordPolicyComponent } from './password-policy.component';
import { PasswordPolicyFormComponent } from './components/password-policy-form/password-policy-form.component';
import { AddPasswordPolicyComponent } from './components/add-password-policy/add-password-policy.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    PasswordPolicyComponent,
    PasswordPolicyFormComponent,
    AddPasswordPolicyComponent
  ],
  imports: [
    CommonModule,
    PasswordPolicyRoutingModule,
    SharedModule
  ]
})
export class PasswordPolicyModule { }
