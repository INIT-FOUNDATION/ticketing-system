import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils.service';
declare var require: any;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public prescriptionDiagRef;
  private _userDetails: any;
  private profilePicUrl: any; //  = 'assets/images/default-avatar.png';
  private appVersionNo: string = require('../../../../../package.json').version;
  private userDataSubject: BehaviorSubject<any>;
  public userData: Observable<any>;
  private profilePicSubject: BehaviorSubject<any>;
  public profilePic: Observable<any>;
  private signaturePicSubject: BehaviorSubject<any>;
  public signaturePic: Observable<any>;
  public permission;
  private permissionSubject: BehaviorSubject<any>;
  public permissionPresent$: Observable<any>;
  public searchValue:BehaviorSubject<any>;

  // Please maintain the order of below array as redirection works as per permission in below order.
  private adminModulesArray = [];
  private modulesAndRoutes = {}
  constructor(private utilsService: UtilsService, private http: HttpClient) {
    this.userDataSubject = new BehaviorSubject<any>(null);
    this.userData = this.userDataSubject.asObservable();
    this.profilePicSubject = new BehaviorSubject<any>(null);
    this.profilePic = this.profilePicSubject.asObservable();
    this.signaturePicSubject = new BehaviorSubject<any>(null);
    this.signaturePic = this.signaturePicSubject.asObservable();
    this.permissionSubject = new BehaviorSubject<any>(false);
    this.permissionPresent$ = this.permissionSubject.asObservable();
    this.searchValue = new BehaviorSubject<any>(null);

  }

  set permissions(flag){
    this.permissionSubject.next(flag);
  }

  get userDetails() {
    if (this._userDetails) {
      return this._userDetails;
    } else {
      const Userdata = this.getUserDetails().then(res => {
        this.userDetails = res;
        this.permission = res.permission;
        return Userdata;
      }).catch(err => {
        console.log(err);
      });
    }
  }

  set userDetails(userDetails) {
    this._userDetails = {...this._userDetails, ...userDetails};
    this.userDataSubject.next(this._userDetails);
  }

  async getUserDetails() {
    const userDetailsData = await this.getUserDetails_http().toPromise();
    return userDetailsData;
  }

  setProfilePic(data: any) {
    this.profilePicSubject.next(data);
  }

  setSignaturePic(data:any){
    this.signaturePicSubject.next(data);
  }

  get appVersion() {
    return this.appVersionNo;
  }

  set appVersion(val) {
    this.appVersionNo = val;
  }

  checkPermission(module): any {
    if (this.permission) {
      return this.permission[module] ? this.permission[module] : 'NP';
    }
  }

  importPermission(module): boolean {
    let m = this.utilsService.replaceSpaceToUnderscore(module);
    return this.permission[m] == 'IMPORT' || this.permission[m] == 'FULL';
  }

  addeditPermission(module): boolean {
    // let m = this.utilsService.replaceSpaceToUnderscore(module);
    if(this.permission) {
      return this.permission[module] == 'ADDEDIT' || this.permission[module] == 'FULL';
    }
  }

  addeditPermissionForAppointment(): boolean {
    // let m = this.utilsService.replaceSpaceToUnderscore(module);
    if(this.permission) {
      return (this.permission['Patient Management'] == 'ADDEDIT' || this.permission['Patient Management'] == 'FULL') ||
              (this.permission['Appointments'] == 'ADDEDIT' || this.permission['Appointments'] == 'FULL');
    }
  }

  getAdminModule() {
    return this.adminModulesArray;
  }

  getAdminModuleRoute() {
    return this.modulesAndRoutes;
  }

  setAdminModule(adminModules) {
    this.adminModulesArray = adminModules;
  }

  setAdminModuleRoute(adminModuleRoutes) {
    this.modulesAndRoutes = adminModuleRoutes;
  }

  getUserDetails_http() {
    return this.http.get<any>(`${environment.user_prefix_url}/getLoggedInUserInfo`)
    .pipe(map((res) => {
      return this.handlePermissionJson(res.loggedInUser);
    }));
  }

  getUserDetails_withoutcache() {
    return this.http.get<any>(`${environment.user_prefix_url}/getLoggedInUser`)
    .pipe(map((res) => {
      return res.loggedInUser;
    }));
  }

  handlePermissionJson(res: any) {
    console.log('handlePermissionJson', res)
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
    return res;
  }


  updatePermissions(role, permission) {
    let roleKey = this.utilsService.replaceSpaceToUnderscore(role.value.module_name);
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

  showOrganization() {
    let hierarchy =  this.userDetails.hierarchy;
    if (hierarchy == 'GOVT') {
      return false;
    } else {
      return true;
    }
  }

}
