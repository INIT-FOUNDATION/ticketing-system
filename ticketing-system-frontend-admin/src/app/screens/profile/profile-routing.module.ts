import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHierarchyComponent } from './components/user-hierarchy/user-hierarchy.component';
import { ProfileComponent } from './profile.component';


const routes: Routes = [
  {path:'', component:ProfileComponent},
  {path:'hierarchy', component:UserHierarchyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
