import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { DataService } from '../modules/shared/services';
// import { AuthService } from '../screens/auth/services/auth.service';
// import { UtilsService } from '../modules/shared/services'
import { tap, map, take } from 'rxjs/operators';
import { DataService } from '../modules/shared/services/data.service';
import { UtilsService } from '../modules/shared/services/utils.service';
import { AuthService } from '../screens/auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private dataService: DataService,
    private auth: AuthService,
    private utilsService: UtilsService,
    private router: Router,
    ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const routePermission = next.data['permission'];
    return this.auth.currentUser.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (loggedIn && this.utilsService.isPresent(routePermission) && this.utilsService.isPresent(this.dataService.permission)) {
          // this.router.navigate(['/login']);

          if (this.dataService.checkPermission(routePermission) !== 'NP') {
            return true;
          } else {
            this.router.navigate(['/forbidden']);
            return false;
          }
        }
      })
    );
  }

}
