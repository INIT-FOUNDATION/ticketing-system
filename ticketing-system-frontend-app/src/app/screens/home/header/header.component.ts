import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Location } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private navControl: NavController,
    private _location: Location
  ) {}

  totalNotificationsCount: any = [];
  showHideCount: boolean = false;
  ngOnInit() {
    this.notificationsCount();
  }

  notificationsCount() {
    // this.notificationService.notificationsCount().subscribe((res: any) => {
    //   this.totalNotificationsCount = res?.count;
    // });
  }

  redirectToPreviousPage() {
    // this.navControl.navigateRoot([`/home/${this.homeService.header.route}`]);
    this._location.back();
    this.showHideCount = true;
  }

  directTonotifications() {
    this.navControl.navigateRoot([`/home/notifications`]);
    this.totalNotificationsCount = 0;
  }
}
