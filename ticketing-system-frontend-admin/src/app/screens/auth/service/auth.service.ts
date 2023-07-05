import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any | null>;
  private _userId;
  private isLogout = false;
  private refreshCaptchaSubject: BehaviorSubject<number>;
  private refreshCaptcha: Observable<number | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private encDecService: EncDecService,
    private util: UtilsService,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('userToken')));
    this.currentUser = this.currentUserSubject.asObservable();

    this.refreshCaptchaSubject = new BehaviorSubject<number>(0);
    this.refreshCaptcha = this.refreshCaptchaSubject.asObservable();
  }

  public set refresh(flag: number) {
    this.refreshCaptchaSubject.next(flag);
  }

  public get refreshObs(): Observable<number> {
    return this.refreshCaptcha;
  }

  public set userId(userId) {
    this._userId = userId;
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public get logoutHappened(): boolean {
    return this.isLogout;
  }

  public logoutHappenedSet(flag) {
    this.isLogout = flag;
  }

  login(data) {
    return this.http.post(environment.auth_prefix_url + '/login', data, {responseType: 'text'})
    .pipe(map(user => {
      return user;
    }));
  }

  postLoginUserUpdate(username) {
    return this.http.post(`${environment.auth_prefix_url}/postLoginUserUpdate`, username, {responseType: 'text'});
  }

  verifyPhoneNumber(mobileno) {
    mobileno = this.encDecService.set('' + mobileno);
    return this.http.post<any>(`${environment.user_prefix_url}/verifyPhoneNumber`, {phoneNumber: mobileno});
  }

  verifyMobileNumber(data) {
    return this.http.post<any>(`${environment.user_prefix_url}/verifyMobileNumber/`, data);
  }

  verifyForgotPasswordOtp(data) {
    return this.http.post<any>(`${environment.user_prefix_url}/verifyForgotPasswordOtp/`, data);
  }

  resetPassword(data) {
    return this.http.post<any>(`${environment.user_prefix_url}/resetPassword`, data);
  }


  logout(){
    if (sessionStorage.getItem('userToken')) {
      const headers = new HttpHeaders();
      headers.set('Authorization', `${JSON.parse(sessionStorage.getItem('userToken'))}`);
      this.http.post(environment.auth_prefix_url + '/logout', '', { headers, responseType: 'text'}).subscribe();
      sessionStorage.removeItem('userToken');
      // sessionStorage.removeItem('userDetails');
      sessionStorage.clear();
      this.currentUserSubject.next(null);
      this.dataService.setProfilePic(null);
      this.dataService.userDetails = null;
      this.isLogout = true;
      this.router.navigate(['/login', { outlets: { popup: null }}]);
      return false;
    } else {
      sessionStorage.clear();
      this.currentUserSubject.next(null);
      this.dataService.setProfilePic(null);
      this.dataService.userDetails = null;
      this.isLogout = true;
      this.router.navigate(['/login', { outlets: { popup: null }}]);
    }
  }

  updatePassword(data) {
    const id = this._userId;
    data.userId = this.encDecService.set('' + id);
    return this.http.post<any>(`${environment.user_prefix_url}/updatePassword`, data);
  }

  getCaptcha() {
    return this.http.post<any>(`${environment.auth_prefix_url}/getRecaptcha`, {});
  }

  getLoginOtp(payload) {
    return this.http.post<any>(`${environment.auth_prefix_url}/getOtp`, payload);
  }

  verifyLoginOtp(payload) {
    return this.http.post(`${environment.auth_prefix_url}/verifyOtp`, payload, {responseType: 'text'});
  }

  redirectAsperPermission(user?) {
    let adminModule = this.dataService.getAdminModule();
    let moduleRoutes = this.dataService.getAdminModuleRoute();
    for (let module of adminModule) {
      if (this.dataService.checkPermission(module) != 'NP') {
        let routeUrl = moduleRoutes[module];
        if (user) {
          this.currentUserSubject.next(user);
        }
        this.router.navigate([`/${routeUrl}`]);
        break;
      }
    }
  }


  getUserPermission() {
    return this.http.get<any>(`${environment.user_prefix_url}/getUserPermissions`)
    .pipe(map((res) => {
      const permissions = {};
      // const module_json = JSON.parse(res.permissions);
      res.permissions = JSON.parse(res.permissions);
      res.permission = {};
      const moduleJsonKey = 'permissions';
      if (res[moduleJsonKey][0] && res[moduleJsonKey][0].children) {
        for (const role of res[moduleJsonKey][0].children) {
          if (role.children) {
            for (const roleChild of role.children) {
              this.updatePermissions(roleChild, res.permission);
            }
          } else {
            this.updatePermissions(role, res.permission);
          }
        }
      }
      console.log('permissions', res);
      return res.permission;
    }));
  }


  getUserDetails() {
    return this.http.get<any>(`${environment.user_prefix_url}/getLoggedInUserInfo`)
    .pipe(map((res) => {
      return this.handlePermissionJson(res);
    }));
  }

  handlePermissionJson(res: any) {
    console.log('handlePermissionJson', res)
    if(res.module_json){
      res.module_json = JSON.parse(res.module_json);
      res.permission = {};
    const moduleJsonKey = 'module_json';
    if (res[moduleJsonKey][0] && res[moduleJsonKey][0].children) {
      for (const role of res[moduleJsonKey][0].children) {
        if (role.children) {
          for (const roleChild of role.children) {
            this.updatePermissions(roleChild, res.permission);
          }
        } else {
          this.updatePermissions(role, res.permission);
        }
      }
    }
    }

    return res;
  }


  updatePermissions(role, permission) {
    let roleKey = this.util.replaceSpaceToUnderscore(role.value.module_name);
    permission[roleKey] = 'NP';
    if (role.value.access.import === 'default' && role.value.access.addedit === 'default') {
      permission[roleKey] = 'DEFAULT';
    } else if (role.value.access.import === 'Y' && role.value.access.addedit === 'Y') {
      permission[roleKey] = 'FULL';
    } else if (role.value.access.import === 'Y') {
      if(role.value.access.addedit === 'NA') {
        permission[roleKey] = 'FULL';
      } else {
        permission[roleKey] = 'IMPORT';
      }
    } else if (role.value.access.addedit === 'Y') {
      if(role.value.access.import === 'NA') {
        permission[roleKey] = 'FULL';
      } else {
        permission[roleKey] = 'ADDEDIT';
      }
    } else if (role.value.access.read === 'Y') {
      permission[roleKey] = 'READ';
    }
  }


  getLoggedInUserInfo() {
    return this.http.get<any>(`${environment.user_prefix_url}/getLoggedInUserInfo`)
    .pipe(map((r) => {
      if (r.loggedInUser) {
        r.loggedInUser.user_id = this.decryptIdFormatItToInt(r.loggedInUser.user_id);
        r.loggedInUser.userFacilitySupervisor_id = this.decryptIdFormatItToInt(r.loggedInUser.userFacilitySupervisor_id);
        r.loggedInUser.role_id = this.decryptIdFormatItToInt(r.loggedInUser.role_id);
       }
      return r.loggedInUser;
    }));
  }

  getAccessControlList(role_id) {
    return this.http.get<any>(`${environment.admin_prefix_url}/role/getRoleAccessList/${role_id}`);
  }

  getCombinedAccessControlList(user_id, role_id) {
    return this.http.get<any>(`${environment.admin_prefix_url}/role/getCombinedAccessList/${user_id}/${role_id}`);
  }


  decryptIdFormatItToInt(id) {
    let intId = 0;
    if(id){
      try {
        id = this.encDecService.get(id);
        if (id && !isNaN(id)) {
          intId = parseInt(id);
        }
      } catch (e) {console.log(e);
      }
    }

    return intId;
  }

  setHierarchy(hierarchy, user_name) {
    return this.http.post(`${environment.auth_prefix_url}/setConfig`, {type: hierarchy, user_name: user_name}, {responseType: 'text'})
  }


  /*Patient Login*/
  generatePatientOtp(payload) {
    return this.http.post(`${environment.auth_prefix_url}/generateOTP`, payload);
  }

  verifyPatientOtp(payload) {
    return this.http.post(`${environment.auth_prefix_url}/validateOTP`, payload);
  }

}
