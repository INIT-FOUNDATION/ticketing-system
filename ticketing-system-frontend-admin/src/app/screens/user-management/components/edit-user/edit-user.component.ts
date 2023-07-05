import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  constructor(private pageHeaderService: PageHeaderService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {

                let userId = activatedRoute.snapshot.params.user_id;
                if (userId) {
                  try {
                    userId = parseInt(userId)
                  } catch (error) {
                    userId = null
                  }
                  if (!userId) {
                    this.router.navigate(['/usermanagement']);
                    return;
                  }
                } else {
                  this.router.navigate(['/usermanagement']);
                  return;
                }
              }

  ngOnInit(): void {
    this.pageHeaderService.pageHeaderSet = 'Edit User';
    this.pageHeaderService.backButtonRequired = true;
  }

}
