import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';

@Component({
  selector: 'app-get-started',
  templateUrl: 'get-started.page.html',
  styleUrls: ['get-started.page.scss'],
})
export class GetStartedPage {
  public sliderOptions = {
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true
    }
  };

  constructor(private router: Router, public utilityService: UtilityService) {}

  getStarted() {
    this.router.navigate(['login']);
  }
}
