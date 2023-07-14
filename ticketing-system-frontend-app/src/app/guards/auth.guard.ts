import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../screens/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private auth: AuthService,
              private navController: NavController
              ) {
  }
  exclude_urls = ['/login', '/splash', '/get-started', '/sign-up']
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.auth.currentUserValue) {
      if (this.exclude_urls.indexOf(state.url) != -1) {
        this.navController.navigateRoot(['/home/doctor-search']);
      }
      return true;
    } else {
      if (this.exclude_urls.indexOf(state.url) == -1) {
        this.router.navigate(['/login']);
      }
      return true;
    }
  }

}
