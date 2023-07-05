import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DataView } from 'primeng/dataview';
import { CommonDataViewComponent } from 'src/app/modules/common-data-view/common-data-view.component';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { RoleManagementService } from './services/role-management.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  rolesData = [];
  header = 'Role Management';
  rowsPerPage = 5;
  rows = [
    {value: 5, label: '5'},
    {value: 10, label: '10'},
    {value: 15, label: '15'},
    {value: 20, label: '20'},
  ]
  @ViewChild('dataView') dataView : CommonDataViewComponent;
  @ViewChild('listViewItem') listViewItem : TemplateRef<any>;
  @ViewChild('gridViewItem') gridViewItem : TemplateRef<any>;
  constructor(private roleManagementService: RoleManagementService,
            private pageHeaderService: PageHeaderService,
            private router: Router,
            private utilService: UtilsService,
            private dataService: DataService) { }

  ngOnInit(): void {
    this.pageHeaderService.pageHeaderSet = this.header;
    this.pageHeaderService.backButtonRequired = false;
    this.getRolesList();
  }

  getRolesList() {
    this.roleManagementService.getRoles().subscribe((res: any) => {
      this.rolesData = res;
      this.dataView.data = this.rolesData;
    });
  }

  addRole() {
    this.router.navigate(['/rolemanagement/add-role']);
  }

  editRole(gridData) {
    const navigationExtras: NavigationExtras = {
      state: { editData: JSON.stringify(gridData) },
    };
    this.router.navigate([`/rolemanagement/edit-role/${gridData.role_id}`]);
  }

  filter(data) {
    this.dataView.dataViewTable.filter(data);
  }

  filterByStatus(data) {
    let dataViewData = this.rolesData;
    let filteredData = dataViewData.filter(role => role.status == data);
    this.dataView.data = filteredData
  }

  updateRoleStatus(role_name, role_id, new_status) {
    let roleStatusObj = { "role_name": role_name, "role_id": role_id, "is_active": new_status, "userId": this.dataService.userDetails.user_id}
    this.roleManagementService.updateRolesStatus(roleStatusObj).subscribe((res) => {
      if (new_status === 1) {
        this.utilService.showSuccessToast('Role Activated Successfully');
      } else {
        this.utilService.showSuccessToast('Role De-Activated Successfully');
      }
      this.getRolesList();
    });
  }
}
