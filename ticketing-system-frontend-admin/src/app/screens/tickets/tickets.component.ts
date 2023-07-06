import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Colmodel } from 'src/app/modules/common-data-table/model/colmodel.model';
import { CommonDataViewComponent } from 'src/app/modules/common-data-view/common-data-view.component';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  userGridData = [];
  header = 'Ticket Management';
  rowsPerPage = 50;
  cols: Colmodel[] = [];
  contactNumber;
  rows = [
    {value: 50, label: '50'},
    {value: 100, label: '100'}
  ];
  currentPage = 1;
  removePermission = false;
  userDetails;
  @ViewChild('ticketsGrid') ticketsGrid : CommonDataViewComponent;
  constructor(private pageHeaderService: PageHeaderService,
    private router: Router,
    private encDecService: EncDecService,
    private utilService: UtilsService,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.pageHeaderService.pageHeaderSet = this.header;
    this.pageHeaderService.backButtonRequired = false;
    this.prepareAppointmentGridCols();
    let payload = {};
    this.getTicketList(payload);
    if (this.dataService.userDetails.role_id == 1) {
      this.removePermission = true;
    }
  }

  prepareAppointmentGridCols() {
    this.cols = [
      new Colmodel('ticket_id', 'Ticket ID', false, false, true),
      new Colmodel('department_type_name', 'Department', false, false, false),
      new Colmodel('assigned_to_name', 'Doctor', false, false, false),
      new Colmodel('appointment_status_name', 'Status', false, false, false),
    ]
  }

  getTicketList(payload) {
    payload['limit'] = true;
    let pageSize = this.ticketsGrid && this.ticketsGrid.rows ? this.ticketsGrid.rows : 50;
    payload["current_page"] = this.currentPage;
    payload["page_size"] = pageSize;
    payload["search"] = this.contactNumber;
  }

  onPageChangeEvent(event) {
    console.log(event);
    this.currentPage = event.first == 0 ? 1 : (event.first/event.rows) + 1;
    this.ticketsGrid.rows = event.rows;
    const payload = {limit: true};
    this.getTicketList(payload);
  }

  addTicket() {
    this.router.navigate(['tickets/add-ticket'])
  }
}
