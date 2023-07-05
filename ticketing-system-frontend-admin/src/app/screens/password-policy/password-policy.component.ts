import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';

@Component({
  selector: 'app-password-policy',
  templateUrl: './password-policy.component.html',
  styleUrls: ['./password-policy.component.scss']
})
export class PasswordPolicyComponent implements OnInit {
  header = 'Password Policy'
  constructor(private pageHeaderService: PageHeaderService,
              private router: Router) { }

  ngOnInit(): void {
    this.pageHeaderService.pageHeaderSet = this.header;
    this.pageHeaderService.backButtonRequired = false;
  }

}
