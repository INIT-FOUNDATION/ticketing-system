import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketsComponent } from './tickets.component';
import { AddTicketComponent } from './components/add-ticket/add-ticket.component';
import { EditTicketComponent } from './components/edit-ticket/edit-ticket.component';
import { AddVisitComponent } from './components/add-visit/add-visit.component';

const routes: Routes = [
  {path: '', component: TicketsComponent},
  {path: 'add-ticket', component: AddTicketComponent},
  {path: 'edit-ticket/:ticket_id', component: EditTicketComponent},
  {path: 'add-visit/:ticket_id', component: AddVisitComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }
