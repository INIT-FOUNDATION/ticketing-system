import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsRoutingModule } from './tickets-routing.module';
import { TicketsComponent } from './tickets.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component';
import { AddTicketComponent } from './components/add-ticket/add-ticket.component';
import { EditTicketComponent } from './components/edit-ticket/edit-ticket.component';


@NgModule({
  declarations: [
    TicketsComponent,
    TicketFormComponent,
    AddTicketComponent,
    EditTicketComponent
  ],
  imports: [
    CommonModule,
    TicketsRoutingModule,
    SharedModule
  ]
})
export class TicketsModule { }
