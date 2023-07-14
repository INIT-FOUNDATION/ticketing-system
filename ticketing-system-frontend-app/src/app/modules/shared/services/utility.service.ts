import { Platform } from '@ionic/angular';
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UtilityService {


  constructor(private platform: Platform) {}


  isDesktop() {
    return (
      this.platform.is('desktop') ||
      this.platform.is('mobile') ||
      this.platform.is('mobileweb')
    )
  }

  isMobile() {
    return (
      this.platform.is('android') ||
      this.platform.is('ios') ||
      this.platform.is('hybrid') ||
      this.platform.is('capacitor') ||
      this.platform.is('cordova')
    )
  }
}
