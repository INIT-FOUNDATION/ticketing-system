import { Platform } from '@ionic/angular';
import { Injectable } from "@angular/core";
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';

@Injectable({providedIn: 'root'})
export class AppPreferencesService {
  private DICT = "PATIENT_APP_PREFERENCES";
  private isMobile = true;
  constructor(private appPreferences: AppPreferences,
              private platform: Platform) {
    this.isMobile = this.platform.is('cordova')
  }


  setValue(a_key: string, a_value: string) {
    return new Promise((resolve, reject) => {
      if(this.isMobile) {
        this.appPreferences.store(this.DICT, a_key, a_value).then((res) => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      } else {
        localStorage.setItem(a_key, a_value);
        resolve(true);
      }
    });
  }


  getValue(a_key: string) {
    return new Promise((resolve, reject) => {
      if (this.isMobile) {
        this.appPreferences.fetch(this.DICT, a_key).then((res) => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      } else {
        let data = localStorage.getItem(a_key);
        resolve(data);
      }
    })
  }

  clearAll() {
    return new Promise((resolve, reject) => {
      if (this.isMobile) {
        this.appPreferences.clearAll().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err);
        })
      } else {
        localStorage.clear();
        resolve(true);
      }
    })
  }
}
