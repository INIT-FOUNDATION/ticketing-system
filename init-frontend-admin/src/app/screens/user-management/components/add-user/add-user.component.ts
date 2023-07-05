import { Component, OnInit } from '@angular/core';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private pageHeaderService: PageHeaderService) { }

  ngOnInit(): void {
    this.pageHeaderService.pageHeaderSet = 'Add User';
    this.pageHeaderService.backButtonRequired = true;
  }

}
