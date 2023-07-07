import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TreeNode } from "primeng/api";
import { Observable } from "rxjs";
import { EncDecService } from "src/app/modules/shared/services/encryption-decryption.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private http: HttpClient,
              private encDecService: EncDecService) {}

  getUserdataGridWithCount(payload) {
    return this.http.post<any>(`${environment.admin_prefix_url}/user/getUserdataGridCount`, payload);
  }

  getActiveRoles(){
    return this.http.get<any>(`${environment.admin_prefix_url}/role/getActiveRoleList`)
  }

  getRoles(): Observable<any> {
    return this.http.get(`${environment.admin_prefix_url}/role/getRoles`);
  }

  createUser(postParams: any): Observable<any> {
    return this.http.post(`${environment.admin_prefix_url}/user/createUser`, postParams);
  }

  getUserById(user_id): Observable<any> {
    return this.http.get(`${environment.admin_prefix_url}/user/user/${user_id}`);
  }

  getUserAccessList(user_id): Observable<any> {
    return this.http.get(`${environment.admin_prefix_url}/user/getUserAccessList/${user_id}`);
  }

  updateUser(userId: any, postParams: any): Observable<any> {
    postParams ['user_id'] =  this.encDecService.set('' + userId)
    return this.http.post(`${environment.admin_prefix_url}/user/editUser`, postParams);
  }

  resetPasswordByAdmin(userId: any, passwordType?) {
    return this.http.post<any>(
      `${environment.admin_prefix_url}/user/resetPasswordByAdmin`,
      {
        'passwordType': passwordType,
        'userId': userId
      }
    );
  }

  updateUsersStatus(userId, status) {
    return this.http.post<any>(`${environment.admin_prefix_url}/user/updateUserStatus`, {user_id: this.encDecService.set('' + userId), isActive: status});
  }

  deleteUser(payLoad) {
    return this.http.post<any>(`${environment.admin_prefix_url}/user/deleteUser`, payLoad);
  }

  getAllUsersByHospital(payLoad) {
    return this.http.post<any>(`${environment.admin_prefix_url}/user/getAllUsersByHospital`, payLoad);
  }

  getUserHierarchy(user_id): Observable<TreeNode[]> {
    return this.http.get<TreeNode[]>(`${environment.admin_prefix_url}/user/getUserHierarchy/${user_id}`);
  }
  getUserFullHierarchy(user_id): Observable<TreeNode[]> {
    return this.http.get<TreeNode[]>(`${environment.admin_prefix_url}/user/getUserFullHierarchy/${user_id}`);
  }
}
