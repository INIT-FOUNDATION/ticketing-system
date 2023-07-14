import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileFormPageRoutingModule } from './profile-form-routing.module';

import { ProfileFormPage } from './profile-form.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileFormPageRoutingModule,
    SharedModule
  ],
  declarations: [ProfileFormPage]
})
export class ProfileFormPageModule {}
