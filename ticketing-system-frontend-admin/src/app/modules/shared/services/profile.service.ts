import { EncDecService } from './encryption-decryption.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { DataService } from './data.service';
import { map } from 'rxjs/operators';
import { UtilsService } from './utils.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private dataServ: DataService,
    private util: UtilsService,
    private sanitizer: DomSanitizer,
    private encDecService: EncDecService
  ) { }

  getUserDetails() {
    // alert();
    return this.http.post<any>(environment.user_prefix_url + '/getDetails', {})
    .pipe(map((r: any) => {
      if (r) {
        r.user_id = this.decryptIdFormatItToInt(r.user_id);
        r.userFacilitySupervisor_id = this.decryptIdFormatItToInt(r.userFacilitySupervisor_id);
        r.role_id = this.decryptIdFormatItToInt(r.role_id);
        this.dataServ.userDetails = r;
        if (r.profile_picture_url) { this.getProfilePic().subscribe(); };
       }
      return r;
    }))
    ;
  }

  getLoggedInUserInfo() {
    return this.http.get<any>(`${environment.user_prefix_url}/getLoggedInUserInfo`)
    .pipe(map((r) => {
      if (r) {
        r.loggedInUser.user_id = this.decryptIdFormatItToInt(r.loggedInUser.user_id);
        r.loggedInUser.userFacilitySupervisor_id = this.decryptIdFormatItToInt(r.loggedInUser.userFacilitySupervisor_id);
        r.loggedInUser.role_id = this.decryptIdFormatItToInt(r.loggedInUser.role_id);
        this.dataServ.userDetails = r.loggedInUser;
        if (r.loggedInUser.profile_picture_url) { this.getProfilePic().subscribe(); };
       }
      return r.loggedInUser;
    }));
  }

  getAccessControlList(role_id) {
    return this.http.get<any>(`${environment.admin_prefix_url}/role/getRoleAccessList/${role_id}`);
  }

  getSpecialityList() {
    return this.http.get(`${environment.admin_prefix_url}/speciality/getDoctorSpecialities`);
  }

  getProfilePic() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const userId = this.encDecService.set(""+this.dataServ.userDetails.user_id)
    return this.http.post<Blob>(`${environment.admin_prefix_url}/user/download/profilePic`,{userId:userId},
      { headers, responseType: 'blob' as 'json' })
      .pipe(map(data => {
        if (data) {
          const self = this;
          this.util.blobToDataURL(data, (dataurl) => {
            self.dataServ.setProfilePic(dataurl);
          });
        }
        return data;
      }));
  }


  getProfilePicByUserId(user_id) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const userId = this.encDecService.set(""+user_id)
    return this.http.post<Blob>(`${environment.admin_prefix_url}/user/download/profilePic`,{userId:userId},
      { headers, responseType: 'blob' as 'json' })
      .pipe(map(async(data) => {
        if (data) {
          let blobUrl = await this.blobToDataURL(data);
          return blobUrl;
        } else {
          return 'assets/Profile-photo.svg';
        }
      }));
  }


  blobToDataURL(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = _e => resolve(reader.result as string);
      reader.onerror = _e => reject(reader.error);
      reader.onabort = _e => reject(new Error("Read aborted"));
      reader.readAsDataURL(blob);
    });
  }

  getSignaturePic() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const requestOptions: Object = {
      responseType: 'blob' as 'blob'
    };
    const userId = this.encDecService.set(""+this.dataServ.userDetails.user_id)
    return this.http.get<Blob>(`${environment.admin_prefix_url}/user/downloadSignature`, { headers, responseType: 'blob' as 'json' })
      .pipe(map(data =>
       {
        if (data) {
          const self = this;
          this.util.blobToDataURL(data, (dataurl) => {
            self.dataServ.setSignaturePic(dataurl);
          });
        }
        return data;
      }));
  }


  getStates() {
    return this.http.get<any>(environment.admin_prefix_url + '/location/states');
  }

  getDistricts(stateId) {
    return this.http.get<any>(environment.admin_prefix_url + '/location/districts/' + stateId);
  }

  getBlocks(districtId) {
    return this.http.get<any>(environment.admin_prefix_url + '/location/blocks/' + districtId);
  }

  getVillages(blockId) {
    return this.http.get<any>(environment.admin_prefix_url + '/location/villages/' + blockId);
  }

  // getProfileDetails(id) {
  //   return this.http.get<any>(environment.admin_prefix_url+'/profileDetails/'+id);
  //   // /profileDetails/:id
  // }
  updateProfileDetails(id, data) {

    console.log("data", data)
    data.userId = this.encDecService.set(""+id);

    return this.http.post<any>(`${environment.user_prefix_url}/updateUser`, data);
  }


  getNotificationDetails(postParams): Observable <any>{
    return this.http.post(`${environment.admin_prefix_url}/notification/fetchNotifications`, postParams);
  }

  getUnreadNotifications(): Observable <any>{
    return this.http.get(`${environment.admin_prefix_url}/notification/getUnreadNotifications`);
  }

  readNotification(item: any): Observable <any>{
    return this.http.post(
      `${environment.admin_prefix_url}/notification/read`,
      {notificationId: item.notification_id}
    );
  }

  saveProfilePic(id, data: any) {
    return this.http.post(`${environment.admin_prefix_url}/user/uploadProfilePic`, data);
  }

  savesignaturePic(data:any){
    return this.http.post<any>(`${environment.admin_prefix_url}/user/updateSignature`, data);
  }

  updatePassword(id, data) {
    data.userId = id;
    return this.http.post<any>(`${environment.user_prefix_url}/updatePassword`, data);
  }

  sendOTP(postData: any): Observable<any> {
    return this.http.post(`${environment.user_prefix_url}/sendOTPUpdateMobileNumber/`, postData);
  }

  updateMobileNo(postData: any): Observable<any> {
    return this.http.post(`${environment.user_prefix_url}/updateMobileNumber/`, postData);
  }

  parseMsgWithSanitize(item) {
    if (item.placeholder && item.placeholder !== '""') {
      const placeHolder = this.util.parseJson(item.placeholder);
      if (placeHolder instanceof Object) {
        placeHolder.map((e, i) => {
          let msg = e;
          if (e && e.toString().match(/api\/v1\/admin/)) {
            const filename = e.substring(e.lastIndexOf('/') + 1);
            msg = `(<a target="_blank" href="${environment.admin_prefix_url + e.replace('api/v1/admin/', '')}">${filename}</a>)`;
          }
          item.message = item.message.replace(`$${(i + 1)}`, (msg  ? msg  : ''));
          return e;
        });
      }
      return this.sanitizer.bypassSecurityTrustHtml(item.message);
    }
    return item.message;
  }

  parseMsg(item) {
    if (item.placeholder && item.placeholder !== '""') {
      const placeHolder = this.util.parseJson(item.placeholder);
      if (placeHolder instanceof Object) {
        placeHolder.map((e, i) => {
          let msg = e;
          if (e && e.toString().match(/api\/v1\/admin/)) {
            const filename = e.substring(e.lastIndexOf('/') + 1);
            msg = `(<a target="_blank" href="${environment.admin_prefix_url + e.replace('api/v1/admin/', '')}">${filename}</a>)`;
          }
          item.message = item.message.replace(`$${(i + 1)}`, (msg  ? msg  : ''));
          return e;
        });
      }
      return item.message;
    }
    return item.message;
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

  getAllLanguages() {
    return this.http.get(
      `${environment.admin_prefix_url}/languages/list`
    )
  }
}

