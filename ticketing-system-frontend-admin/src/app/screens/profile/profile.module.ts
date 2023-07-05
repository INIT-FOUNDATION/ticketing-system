import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { UserHierarchyComponent } from './components/user-hierarchy/user-hierarchy.component';
import {OrganizationChartModule} from 'primeng/organizationchart';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileFormComponent,
    UserHierarchyComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    OrganizationChartModule
  ]
})
export class ProfileModule { }
