import { Component, OnInit, Optional } from '@angular/core';
import {
  Platform,
  IonRouterOutlet,
  NavController,
  AlertController,
} from '@ionic/angular';
import { App } from '@capacitor/app';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private platform: Platform,
    public utilityService: UtilityService,
    private navControl: NavController,
    private alertController: AlertController,
    public plt: Platform,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {}

  displayGreeting: any;
  patientName: any;

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      this.confirmExit();
    });
  }

  async confirmExit() {
    const alert = await this.alertController.create({
      header: 'Exit',
      message: "Do you wan't to exit the App",
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            App.exitApp();
          },
        },
      ],
    });

    await alert.present();
  }

  tabChanged($ev) {
    this.navControl.navigateRoot([`/home/${$ev.tab}`]);
    // $ev.setRoot($ev.root);
    if (this.patientName == undefined) {
      // this.getDashboardDetails($ev);
    } else {
      this.setHeader($ev);
    }
  }


  setHeader($ev) {
    let currentDate = new Date();
    this.displayGreeting =
      currentDate.getHours() < 12
        ? 'Good Morning'
        : currentDate.getHours() < 16
        ? 'Good Afternoon'
        : 'Good Evening';
    let setHeaderData: any = {
      value:
        $ev.tab == 'doctor-search'
          ? this.displayGreeting + ', ' + this.patientName + '!'
          : $ev.tab == 'appointments'
          ? 'Appointments'
          : $ev.tab == 'reminder'
          ? 'Reminders'
          : $ev.tab == 'notifications'
          ? 'Notifications'
          : $ev.tab == 'profile'
          ? 'Profile'
          : '',

      icon: $ev.tab == 'notifications' ? false : true,
      data: $ev.tab == 'notifications' ? true : false,
      route: $ev.tab == 'notifications' ? 'notifications' : 'doctor-search',
    };
    // this.homeService.header = setHeaderData;
  }
}
