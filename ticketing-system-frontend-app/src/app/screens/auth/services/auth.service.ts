import { AppPreferencesService } from './../../../modules/shared/services/preferences.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any | null>;
  constructor(
    private http: HttpClient,
    private router: Router,
    private appPreferences: AppPreferencesService
  ) {
    this.appPreferences.getValue('userToken').then((token: any) => {
      this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(token));
      this.currentUser = this.currentUserSubject.asObservable();
    });
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  generateOtp(payload) {
    return this.http.post(
      `${environment.auth_prefix_url}/patient/generateOTP`,
      payload
    );
  }

  validateOtp(payload) {
    return this.http.post(
      `${environment.auth_prefix_url}/patient/validateOTP`,
      payload
    );
  }

  setPin(payload) {
    return this.http.post(
      `${environment.auth_prefix_url}/patient/setPin`,
      payload
    );
  }

  loginByPin(payload) {
    return this.http
      .post(`${environment.auth_prefix_url}/patient/loginByPin`, payload)
      .pipe(
        map((res: any) => {
          this.currentUserSubject.next(res.token);
          return res;
        })
      );
  }

  getResetPinOTP(payload) {
    return this.http.post(
      `${environment.auth_prefix_url}/patient/getResetPinOTP`,
      payload
    );
  }

  verifyResetPinOTP(payload) {
    return this.http.post(
      `${environment.auth_prefix_url}/patient/verifyResetPinOTP`,
      payload
    );
  }

  resetPin(payload) {
    return this.http.post(
      `${environment.auth_prefix_url}/patient/resetPin`,
      payload
    );
  }

  async signOut() {
    try {
      await this.http.get(`${environment.auth_prefix_url}/patient/signOut`).toPromise();
      this.appPreferences.clearAll();
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } catch (error) {
      this.appPreferences.clearAll();
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    }
  }

  getCountryCode() {
    return this.http.get(`${environment.admin_prefix_url}/location/countries`);
  }
}
