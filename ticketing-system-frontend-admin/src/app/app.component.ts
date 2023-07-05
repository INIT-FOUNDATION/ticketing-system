import { Component, OnInit } from '@angular/core';
import { DataService } from './modules/shared/services/data.service';
import { EncDecService } from './modules/shared/services/encryption-decryption.service';
import { SideBarService } from './modules/shared/services/sidebar.service';
import { AuthService } from './screens/auth/service/auth.service';

import * as _ from 'lodash';
import { ProfileService } from './modules/shared/services/profile.service';
import { CommonService } from './modules/shared/services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'init-frontend-admin';

  constructor(public sideBarService: SideBarService,
              public authService: AuthService,
              private encDecService: EncDecService,
              private profileService: ProfileService,
              private dataService: DataService,
              private commonService: CommonService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(async (r) => {
      if (r) {
        try {
          const encryptedData = sessionStorage.getItem('userDetails');
          let decryptedData:any = null;
          try {
            if (encryptedData) {
              decryptedData = this.encDecService.get(encryptedData);
            }
          } catch (err) {
            decryptedData=null;
          }
          if (decryptedData) {
            this.dataService.userDetails = JSON.parse(decryptedData);
            // const accessControlList = await this.authService.getAccessControlList(this.dataService.userDetails.role_id).toPromise();
            let role_id = this.dataService.userDetails.role_id;
            let user_id = this.dataService.userDetails.user_id
            const accessControlList = await this.authService.getCombinedAccessControlList(user_id, role_id).toPromise();
            this.dataService.permission = this.dataService.userDetails.permission;
            if (this.dataService.userDetails.profile_picture_url) {
              this.profileService.getProfilePic().subscribe();
            }
            this.dataService.permissions = true;
            this.commonService.creatAdminModules(accessControlList);
          } else {
            const userDetails = await this.authService.getLoggedInUserInfo().toPromise();
            let role_id = userDetails.role_id;
            let user_id = userDetails.user_id
            const accessControlList = await this.authService.getCombinedAccessControlList(user_id, role_id).toPromise();
            // const accessControlList = await this.authService.getAccessControlList(userDetails.role_id).toPromise();
            if (userDetails) {
              if (userDetails.profile_picture_url) {
                this.profileService.getProfilePic().subscribe();
              }
              userDetails.module_json = accessControlList;
              userDetails.permission = {};
              if (userDetails.module_json && userDetails.module_json.length > 0) {
                _.each(userDetails.module_json, (menuItem) => {
                  this.updatePermissions(menuItem, userDetails.permission);
                });
              }
              this.dataService.permission = userDetails.permission;
              this.dataService.permissions = true;
              this.dataService.userDetails = userDetails;
              const encryptedData = this.encDecService.set(JSON.stringify(userDetails));
              sessionStorage.setItem('userDetails', encryptedData);
              this.dataService.permissions = true;
              this.commonService.creatAdminModules(accessControlList);
            }
          }
        } catch (err) {
          console.log('Error Getting UserDetails');
          const encryptedData = sessionStorage.getItem('userDetails')
          const decryptedData:any = this.encDecService.get(encryptedData);
          this.dataService.userDetails = JSON.parse(decryptedData);
          // const accessControlList = await this.authService.getAccessControlList(this.dataService.userDetails.role_id).toPromise();
          let role_id = this.dataService.userDetails.role_id;
          let user_id = this.dataService.userDetails.user_id
          const accessControlList = await this.authService.getCombinedAccessControlList(user_id, role_id).toPromise();
          this.dataService.permission = this.dataService.userDetails.permission;
          if (this.dataService.userDetails.profile_picture_url) {
            this.profileService.getProfilePic().subscribe();
          }
          this.dataService.permissions = true;
          this.commonService.creatAdminModules(accessControlList);
        }
      }
    });
  }

  updatePermissions(menuItem, permission) {
    let menu_name = menuItem.menu_name;
    permission[menu_name] = 'NP';
    if (menuItem.write_permission == 1 && menuItem.read_permission == 1) {
      permission[menu_name] = 'FULL';
    } else if (menuItem.write_permission == 0 && menuItem.read_permission == 1) {
      permission[menu_name] = 'READ';
    } else if (menuItem.write_permission == 1 && menuItem.read_permission == 0) {
      permission[menu_name] = 'FULL';
    }
  }
}
