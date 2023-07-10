import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {

  constructor(private http: HttpClient) {}

  getRoles() {
    return this.http.get(`${environment.admin_prefix_url}/role/getRoles`);
  }

  getLevels() {
    return this.http.get(`${environment.admin_prefix_url}/role/getLevels`);
  }

  getMenuList() {
    return this.http.get<any>(`${environment.admin_prefix_url}/role/getMenuList/1`);
  }

  addRole(roleObj) {
    return this.http.post<any>(`${environment.admin_prefix_url}/role/addRole`, roleObj);
  }

  getSpecificRole(role_id) {
    return this.http.get(`${environment.admin_prefix_url}/role/getRole/${role_id}`);
  }

  updateRoleDetailsRequest(roleObj) {
    return this.http.post<any>(`${environment.admin_prefix_url}/role/updateRoleDetails`, roleObj);
  }

  updateRolesStatus(data) {
    return this.http.post<any>(`${environment.admin_prefix_url}/role/updateRoleStatus`, data)
  }
}
