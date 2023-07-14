import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class LoaderService {
  loaderSubject: BehaviorSubject<any>;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loader$: Observable<any>;
  loader_obj = {

  }
  constructor(private loadingCtrl: LoadingController) {
    this.loaderSubject = new BehaviorSubject<any>(null);
    this.loader$ = this.loaderSubject.asObservable();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'circles',
    });

    loading.present();
    this.loaderSubject.next(loading);
  }

  async hideLoading() {
    this.loader$.subscribe(async(res: HTMLIonLoadingElement) => {
      if (res) {
        try {
          await res.dismiss();
        } catch (error) {
          console.log(error);
        }
      }
    })
  }
}
