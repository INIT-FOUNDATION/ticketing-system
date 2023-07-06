import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { ForbiddenComponent } from './screens/forbidden/forbidden.component';
import { NotFoundComponent } from './screens/not-found/not-found.component';
import { UnAuthorizeComponent } from './screens/un-authorize/un-authorize.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    loadChildren: () => import('./screens/auth/auth.module').then(m => m.AuthModule),
    canActivate: [AuthGuard],
    data: { permission: 'Login' }
  },
  {
    path: 'profile',
    loadChildren: () => import('./screens/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard],
    data: { permission: 'Profile' }
  },
  {
    path: 'rolemanagement',
    loadChildren: () => import('./screens/role-management/role-management.module').then(m => m.RoleManagementModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { permission: 'Role Management' }
  },
  {
    path: 'usermanagement',
    loadChildren: () => import('./screens/user-management/user-management.module').then(m => m.UserManagementModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { permission: 'User Management' }
  },
  {
    path: 'passwordpolicy',
    loadChildren: () => import('./screens/password-policy/password-policy.module').then(m => m.PasswordPolicyModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { permission: 'Password Policy' }
  },
  {
    path: 'tickets',
    loadChildren: () => import('./screens/tickets/tickets.module').then(m => m.TicketsModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { permission: 'Tickets' }
  },
  { path: 'unauthorized', component: UnAuthorizeComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: 'notfound'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
