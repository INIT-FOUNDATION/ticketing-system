import { Platform, IonRouterOutlet } from '@ionic/angular';
import { Component, OnInit, Optional } from '@angular/core';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private platform: Platform,
    @Optional() private routerOutlet?: IonRouterOutlet) { }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      // if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      // }
    });
  }

}
