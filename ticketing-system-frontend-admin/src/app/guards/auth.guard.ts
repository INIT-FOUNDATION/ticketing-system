// import { DataService } from 'src/app/modules/shared/services';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DataService } from '../modules/shared/services/data.service';
import { AuthService } from '../screens/auth/service/auth.service';
// import { AuthService } from '../screens/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private auth: AuthService,
              public dataService: DataService
              ) {
  }

  routes_navigation_without_login = ['/login', '/hospital-boarding']
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.auth.currentUserValue) {
      if (this.routes_navigation_without_login.indexOf(state.url) != -1) {
        this.auth.redirectAsperPermission();
      }
      return true;
    } else {
      if (this.routes_navigation_without_login.indexOf(state.url) == -1) {
        this.router.navigate(['/login']);
      }
      return true;
    }
  }

}
