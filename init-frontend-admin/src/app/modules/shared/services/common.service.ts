import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/screens/auth/service/auth.service";
import { DataService } from "./data.service";
import { EncDecService } from "./encryption-decryption.service";
import { ProfileService } from "./profile.service";
import { UtilsService } from "./utils.service";
import * as _ from 'lodash';

@Injectable({providedIn: 'root'})
export class CommonService {


  constructor(private http: HttpClient,
    private authService: AuthService,
    private utilsService: UtilsService,
    private dataService: DataService,
    private profileSer: ProfileService,
    private encDecService: EncDecService,private router: Router) {}

    async getUserDetails(user) {
      let userDetails = await this.profileSer.getLoggedInUserInfo().toPromise();
      let role_id = userDetails.role_id;
      let user_id = userDetails.user_id;

      if (userDetails.patient_id) {
        role_id = 0;
        user_id = 0;
      }
      const accessControlList = await this.authService.getCombinedAccessControlList(user_id, role_id).toPromise();
      // let accessControlList = await this.profileSer.getAccessControlList(userDetails.role_id).toPromise();

      try {
        if (userDetails.user_level === 'Facility') {
          this.authService.logout();
          this.utilsService.showErrorToast('Not Authorized to Login');
          return;
        }
        this.dataService.userDetails = userDetails;
        // sessionStorage.setItem('userDetails', JSON.stringify(res));
        console.log('getUserDetails', userDetails);
        userDetails.module_json = accessControlList;
        userDetails.permission = {};
        const moduleJsonKey = 'module_json';
        if (userDetails.module_json && userDetails.module_json.length > 0) {
          _.each(userDetails.module_json, (menuItem) => {
            this.updatePermissions(menuItem, userDetails.permission);
          });
        }
        console.log(userDetails.permission);
        this.dataService.permission = userDetails.permission;
        this.dataService.permissions = true;
        this.creatAdminModules(accessControlList);
        // sessionStorage.setItem('permission', JSON.stringify(this.dataService.permission));
        if (this.dataService.userDetails.redirect_hosp_admin) {
          this.utilsService.showInfoToast('Please update hospital details and settings');
          this.authService.currentUserSubject.next(user);
          this.router.navigate([`/hospitalmanagement/edit-hospital/${this.dataService.userDetails.hosp_id}`]);
        } else if (this.dataService.userDetails.redirect_profile) {
          this.utilsService.showInfoToast('Please update profile');
          this.authService.currentUserSubject.next(user);
          this.router.navigate([`/profile`]);
        } else {
          this.authService.redirectAsperPermission(user);
        }
      } catch (error) {
        sessionStorage.clear();
      }
    }

    creatAdminModules(accessControlList: any) {
      let adminModules = [];
      let adminModulesRoutes = {}
      _.each(accessControlList, (menuItem) => {
        if (menuItem.display_permission == 1) {
          adminModules.push(menuItem.menu_name);
          adminModulesRoutes[menuItem.menu_name] = menuItem.route_url;
        }
      });
      this.dataService.setAdminModule(adminModules);
      this.dataService.setAdminModuleRoute(adminModulesRoutes);
    }

    async getUserDetailsAfterProfileUpdate() {
      let userDetails = await this.profileSer.getLoggedInUserInfo().toPromise();
      let accessControlList = await this.profileSer.getAccessControlList(userDetails.role_id).toPromise();

      try {
        this.dataService.userDetails = userDetails;
        console.log('getUserDetails', userDetails);
        userDetails.module_json = accessControlList;
        userDetails.permission = {};
        const moduleJsonKey = 'module_json';
        if (userDetails.module_json && userDetails.module_json.length > 0) {
          _.each(userDetails.module_json, (menuItem) => {
            this.updatePermissions(menuItem, userDetails.permission);
          });
        }

        if (userDetails.profile_picture_url) {
          this.profileSer.getProfilePic().subscribe();
        }
        const encryptedData = this.encDecService.set(JSON.stringify(userDetails));
        sessionStorage.setItem('userDetails', encryptedData);

        console.log(userDetails.permission);
        this.dataService.permission = userDetails.permission;
        this.dataService.permissions = true;
        this.creatAdminModules(accessControlList);
        return userDetails;
      } catch (error) {
        sessionStorage.clear();
      }
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

    postLoginUserUpdate(user_name){
      let payload = {'user_name': user_name};
      this.authService.postLoginUserUpdate(payload).subscribe((res) => {
        console.log(res, "res");
      })
    }
}
