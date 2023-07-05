import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/screens/auth/service/auth.service';
import { DataService } from '../../services/data.service';
import { PageHeaderService } from '../../services/page-header.service';
import { SideBarService } from '../../services/sidebar.service';
import { ThemeService } from '../../theme/theme.service';
import * as _ from 'lodash';
import { Location } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menu_items;
  active_theme = 'light_theme';
  dark_theme = false;
  constructor(public pageHeaderService: PageHeaderService,
              public sideBarService: SideBarService,
              private authService: AuthService,
              public themService: ThemeService,
              public dataService: DataService,
              private _location: Location ) { }

  ngOnInit(): void {
    this.prepapreMenuItems();
    let hmis_theme = this.getCookie('theme');
    if (hmis_theme) {
      this.active_theme = hmis_theme;
      if (hmis_theme == 'dark_theme') {
        document.body.classList.add('dark-theme');
      }
    }
    this.themService.setActiveThem(this.active_theme);
    this.themService.getActiveTheme().subscribe(res => {
      if (res == 'light_theme') {
        this.dark_theme = false;
      } else {
        this.dark_theme = true;
      }
    })
  }

  logout() {
    this.authService.logout();
    // this.themService.setActiveThem('light_theme');
    // document.body.classList.remove('dark-theme');
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
          icon: menuItem.icon_class,
          permission: menuItem.display_permission == 1
        }
      )
    });
  }

  // menuItemsInSideBar(){
  //   this.menu_items = [
  //     {label: 'Dashboard', icon: 'dashboard1.svg', route_url: 'dashboard'},
  //     {label: 'User Management', icon: 'admin-user1.svg', route_url: 'usermanagement'},
  //     {label: 'Role Management', icon: 'Roles1.svg', route_url: 'rolemanagement'},
  //     {label: 'Organization Management', icon: 'hospital1.svg', route_url: 'organizationmanagement'},
  //     {label: 'Hospital Management', icon: 'hospital1.svg', route_url: 'hospitalmanagement'},
  //     {label: 'Patient Management', icon: 'hospital1.svg', route_url: 'patientmanagement'},
  //     {label: 'Password Policy', icon: 'Manage-Password1.svg', route_url: 'passwordpolicy'}
  //   ];
  // }

  changeThemeToggle() {
    if (this.active_theme !== 'light_theme') {
      this.themService.setActiveThem('light_theme');
      this.active_theme = 'light_theme';
      document.body.classList.remove('dark-theme');
    } else {
      this.themService.setActiveThem('dark_theme');
      this.active_theme = 'dark_theme';
      document.body.classList.add('dark-theme');
    }
    this.deleteCookie('theme');
    this.setCookie('theme', this.active_theme);
  }

  private getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
        c = ca[i].replace(/^\s+/g, '');
        if (c.indexOf(cookieName) == 0) {
            return c.substring(cookieName.length, c.length);
        }
    }
    return '';
  }

  private deleteCookie(name) {
    this.setCookie(name, '', -1);
  }

  private setCookie(name: string, value: string, expireDays: number = 0, path: string = '') {
    // let d:Date = new Date();
    // d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    // let expires:string = `expires=${d.toUTCString()}`;
    // let cpath:string = path ? `; path=${path}` : '';
    // document.cookie = `${name}=${value}; ${expires}${cpath}`;
    document.cookie = `${name}=${value}`;
  }


  goBackToPrvsScreen() {
    this._location.back();
  }

}
