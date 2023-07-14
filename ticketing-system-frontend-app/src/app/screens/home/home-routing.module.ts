import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: '/tickets',
        pathMatch: 'full',
      },
      {
        path: 'tickets',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/tickets/tickets.module').then((m) => m.TicketsPageModule),
          },
        ],
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/profile/profile.module').then((m) => m.ProfilePageModule),
          },
        ],
      }
    ],
  },
  {
    path: '',
    redirectTo: '/tickets',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
