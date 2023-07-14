import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { UtilityService } from './modules/shared/services/utility.service';
import { AuthService } from './screens/auth/services/auth.service';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [AndroidPermissions],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    public router: Router,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService,
    private androidPermissions: AndroidPermissions,
    private fcm: FCM
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.utilityService.isMobile() && this.platform.is('cordova')) {
        this.router.navigate(['/splash']);
        setTimeout(() => {
          this.router.navigateByUrl('/get-started');
        }, 3000);
        this.fcm.getToken().then((token) => {
          console.log(token);
        });
        // ionic push notification example
        this.fcm.onNotification().subscribe((data) => {
          console.log(data);
          if (data.wasTapped) {
            console.log('Received in background');
          } else {
            console.log('Received in foreground');
          }
        });
        // refresh the FCM token
        this.fcm.onTokenRefresh().subscribe((token) => {
          console.log(token);
        });
      }
    });
  }
}
