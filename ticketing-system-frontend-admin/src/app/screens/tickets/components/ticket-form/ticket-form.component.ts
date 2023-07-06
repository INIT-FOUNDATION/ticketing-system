import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {
  @Input() formType = 'add';
  constructor() { }

  ngOnInit(): void {
  }

}
