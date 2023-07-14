import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';
import { LoginComponent } from './components/login/login.component';
import { ResetPinComponent } from './components/reset-pin/reset-pin.component';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      { path: '', component: LoginComponent },
      { path: 'reset-pin/:mobile_number', component: ResetPinComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
