import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { GetStartedPage } from './get-started.page';

import { GetStartedPageRoutingModule } from './get-started-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetStartedPageRoutingModule
  ],
  declarations: [GetStartedPage]
})
export class GetStartedPageModule {}
