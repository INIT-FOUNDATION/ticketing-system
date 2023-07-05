import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SideBarService } from '../../services/sidebar.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  is_hidden = true;
  menu_items;
  constructor(private sideBarService: SideBarService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.prepapreMenuItems();
  }

  prepapreMenuItems() {
    this.dataService.permissionPresent$.subscribe((res) => {
      if (res) {
        this.menu_items = [];
        this.menuItemsInSideBar();
      }
    });
  }

  menuItemsInSideBar() {
    _.each(this.dataService.userDetails.module_json, (menuItem) => {

      this.menu_items.push(
        {
          label: menuItem.menu_name,
          route_url: menuItem.route_url,
          // icon:  this.getColorIcon(menuItem.icon_class),
          icon:  menuItem.icon_class,
          permission: menuItem.display_permission == 1
        }
      )
    });
  }

  getColorIcon(className) {
    let image_name = ''
    switch (className) {
      case 'custom-admin-dashboard':
        image_name = 'color-dashboard'
        break;
      case 'custom-admin-user':
        image_name = 'color-user-management'
        break;
      case 'custom-admin-roles':
        image_name = 'color-role-management'
        break;
      case 'custom-admin-hospital':
        image_name = 'color-hospital-management'
        break;
      case 'custom-patientManagment':
        image_name = 'color-patient-management'
        break;
      case 'custom-admin-manage-password':
        image_name = 'color-password-policy'
        break;
      case 'custom-organaization':
        image_name = 'color-organization'
        break;
      case 'custom-doctorRoster':
        image_name = 'color-doctor-roster'
        break;
      case 'custom-appointments':
        image_name = 'color-appointments'
        break;

      default:
        image_name = 'color-dashboard'
        break;
    }
    return image_name;
  }

  hideShowSideBar() {
    this.sideBarService.sidebarHiddenSet = !this.is_hidden;
    this.is_hidden = !this.is_hidden
  }

}
