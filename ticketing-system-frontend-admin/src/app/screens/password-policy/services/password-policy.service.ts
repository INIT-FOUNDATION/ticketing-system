import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface PasswordPolicy {
  passwordPolicyId?: any;
  id?: any;
  password_expiry: any;
  password_history: any;
  min_password_length: any;
  complexity: any;
  alphabetical: any;
  numeric: any;
  special_chars: any;
  allowed_special_chars: any;
  max_invalid_attempts: any;
  is_alphabetical?: any;
  is_numeric?: any;
  is_special_chars?: any;
  is_min_password_length?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordPolicyService {

  constructor(private http: HttpClient) { }

  getPasswordPolicy(): Observable<PasswordPolicy[]> {
    return this.http.get<PasswordPolicy[]>(`${environment.admin_prefix_url}/user/password_policy`);
  }

  createPasswordPolicy(postData: PasswordPolicy): Observable<any> {
    return this.http.post<any>(
      `${environment.admin_prefix_url}/user/password_policy`,
      postData
    );
  }

  updatePasswordPolicy(postData: PasswordPolicy): Observable<any> {
    postData.passwordPolicyId = postData.id;
    const url = `${environment.admin_prefix_url}/user/password_policy/${postData.id}`;
    return this.http.post<any>(
      url,
      postData
    );
  }
}
