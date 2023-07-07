import { Component, OnInit } from '@angular/core';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.scss']
})
export class EditTicketComponent implements OnInit {

  constructor(private pageHeaderService: PageHeaderService) { }

  ngOnInit(): void {
    this.pageHeaderService.pageHeaderSet = 'Edit Ticket';
    this.pageHeaderService.backButtonRequired = true;
  }

}
