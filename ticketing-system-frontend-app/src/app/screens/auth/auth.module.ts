import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { NgOtpInputModule } from  'ng-otp-input';
import { ResetPinComponent } from './components/reset-pin/reset-pin.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AuthPageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [
    AuthPage,
    LoginComponent,
    ResetPinComponent
  ]
})
export class AuthPageModule {}
