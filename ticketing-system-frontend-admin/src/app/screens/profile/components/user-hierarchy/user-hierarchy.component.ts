import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { TreeNode } from 'primeng/api';
import { OrganizationChart } from 'primeng/organizationchart';
import { of } from 'rxjs';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';
import { ProfileService } from 'src/app/modules/shared/services/profile.service';
import { UserManagementService } from 'src/app/screens/user-management/services/user-management.service';

@Component({
  selector: 'app-user-hierarchy',
  templateUrl: './user-hierarchy.component.html',
  styleUrls: ['./user-hierarchy.component.scss']
})
export class UserHierarchyComponent implements OnInit {
  hierarchy: any;
  selectedNode: TreeNode;
  @ViewChild('orgChart') orgChart: OrganizationChart

  constructor(private pageHeaderService: PageHeaderService,
              private userService: UserManagementService,
              private activatedRoute: ActivatedRoute,
              private _location: Location,
              private profileService: ProfileService,
              private dataService: DataService) { }

  async ngOnInit() {
    this.pageHeaderService.pageHeaderSet = 'Hierarchy';
    this.pageHeaderService.backButtonRequired = true;
    let user_id = this.dataService.userDetails.user_id;
    if (!user_id) {
      this._location.back();
      return;
    }



    await this.getHierarchy(user_id);
  }

  async getHierarchy(user_id) {
    let data: any = await this.userService.getUserFullHierarchy(user_id).toPromise();
    await this.setProfilePicToHierarchy(data.hierarchy);
    this.hierarchy = [data.hierarchy];
    this.selectedNode = data.selected_node;
    this.orgChart._selection = this.selectedNode;
    setTimeout(() => {
      let divElementColl: HTMLCollectionOf<Element> = document.getElementsByClassName('p-organizationchart-selectable-node');
      let divElement = divElementColl[0].classList.add('p-highlight');

    }, 100);
  }

  async setProfilePicToHierarchy(data) {
    data.data.profile_pic =  await this.getProfilePic(data.data).toPromise();
    this.recursiveFunction(data);
  }

  private recursiveFunction(data: any) {
    if (data.children && data.children.length > 0) {
      _.each(data.children, async (child) => {
        child.data.profile_pic = await this.getProfilePic(child.data).toPromise();
        if (child.children && child.children.length > 0) {
          this.recursiveFunction(child);
        }
      });
    }
  }

  onSelectedNodeExpand(event: {originalEvent:PointerEvent, node: TreeNode}) {
    // event.node.children.push(
    //   {
    //     type: 'person',
    //     label: 'Analysis',
    //     styleClass: 'ui-person',
    //     expanded: true,
    //     data: {name:'Jesse Pinkman', 'avatar': 'jesse.jpg'},
    //   }
    // )
    console.log(event.node.data);

  }

  getProfilePic(data) {
    if (data.profile_picture_url) {
      return this.profileService.getProfilePicByUserId(data.user_id);
    } else {
      return of('assets/Profile-photo.svg');
    }
  }
}
