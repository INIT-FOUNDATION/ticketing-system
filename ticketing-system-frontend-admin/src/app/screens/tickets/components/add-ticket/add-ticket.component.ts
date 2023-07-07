import { Component, OnInit } from '@angular/core';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketComponent implements OnInit {

  constructor(private pageHeaderService: PageHeaderService) { }

  ngOnInit(): void {
    this.pageHeaderService.pageHeaderSet = 'Add Ticket';
    this.pageHeaderService.backButtonRequired = true;
  }

}
