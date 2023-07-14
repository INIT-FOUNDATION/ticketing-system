import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({providedIn: 'root'})
export class ToastrService {
  constructor(private toastController: ToastController) {}

  async presentSuccessToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
      cssClass: 'custom-success'
    });

    await toast.present();
  }

  async presentErrorToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
      cssClass: 'custom-error',
    });

    await toast.present();
  }
}
