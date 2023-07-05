import { Component, OnInit } from '@angular/core';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  constructor(private pageHeaderService: PageHeaderService) { }

  ngOnInit(): void {
    this.pageHeaderService.pageHeaderSet = 'Add Role';
    this.pageHeaderService.backButtonRequired = true;
  }

}
