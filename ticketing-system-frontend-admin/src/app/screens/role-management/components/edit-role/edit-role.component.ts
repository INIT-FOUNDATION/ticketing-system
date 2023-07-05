import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
  roleDetails;
  constructor(private pageHeaderService: PageHeaderService,
              private router: Router,
              private activeRoute: ActivatedRoute) {
        let role_id = activeRoute.snapshot.params.role_id;
        try {
          role_id = parseInt(role_id);
        } catch (error) {
          role_id = null;
        }
        if (!role_id) {
          this.router.navigate(['/rolemanagement'])
        }
  }

  ngOnInit(): void {
    this.pageHeaderService.pageHeaderSet = 'Edit Role';
    this.pageHeaderService.backButtonRequired = true;
  }

}
