import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class TicketService {

  constructor(private http: HttpClient) {}

  getProductList(payload) {
    return this.http.post(
      `${environment.admin_prefix_url}/product/getProductList`,
      payload
    )
  }

  getProduct(payload) {
    return this.http.post(
      `${environment.admin_prefix_url}/product/getProduct`,
      payload
    )
  }

  getTicketList(payload) {
    return this.http.post(
      `${environment.ticket_prefix_url}/getTicketList`,
      payload
    )
  }

  createTicket(payload) {
    return this.http.post(
      `${environment.ticket_prefix_url}/createTicket`,
      payload
    )
  }

  getTicket(payload) {
    return this.http.post(
      `${environment.ticket_prefix_url}/getTicket`,
      payload
    )
  }
}
