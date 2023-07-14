import { UtilityService } from './../../modules/shared/services/utility.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(public router: Router, public utilityService: UtilityService) {}

  ngOnInit() {}

  getStarted() {
    this.router.navigate(['get-started']);
  }
}
