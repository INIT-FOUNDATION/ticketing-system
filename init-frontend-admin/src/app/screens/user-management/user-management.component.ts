import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonDataViewComponent } from 'src/app/modules/common-data-view/common-data-view.component';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';
import { PageHeaderService } from 'src/app/modules/shared/services/page-header.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { UserManagementService } from './services/user-management.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  userGridData = [];
  header = 'User Management';
  rowsPerPage = 50;
  contactNumber;
  rows = [
    {value: 50, label: '50'},
    {value: 100, label: '100'}
  ];
  currentPage = 1;
  removePermission = false;
  userDetails;
  @ViewChild('dataView') dataView : CommonDataViewComponent;
  @ViewChild('listViewItem') listViewItem : TemplateRef<any>;
  @ViewChild('gridViewItem') gridViewItem : TemplateRef<any>;
  constructor(private userManagementService: UserManagementService,
            private pageHeaderService: PageHeaderService,
            private router: Router,
            private encDecService: EncDecService,
            private utilService: UtilsService,
            private dataService: DataService) { }

  async ngOnInit() {
    this.pageHeaderService.pageHeaderSet = this.header;
    this.pageHeaderService.backButtonRequired = false;
    let payload = {};
    this.getUsersList(payload);
    if (this.dataService.userDetails.role_id == 1) {
      this.removePermission = true;
    }

    this.userDetails = await this.dataService.getUserDetails_withoutcache().toPromise();
  }

  getUsersList(payload) {
    payload['limit'] = true;
    let pageSize = this.dataView && this.dataView.rows ? this.dataView.rows : 50;
    payload["current_page"] = this.currentPage;
    payload["page_size"] = pageSize;
    payload["search"] = this.contactNumber;

    this.userManagementService.getUserdataGridWithCount(payload).subscribe((res) => {
      let count = res.count;
      this.processData(res.data, count, payload);
    });
  }

  processData(data,count, payload) {
    const newData = data;
    newData.map((user) => {
      if (user.is_active == '1') {
        user.activeStatus = 'Active';
      } else {
        user.activeStatus = 'Inactive';
      }
    });

    if (this.dataView) {
      this.userGridData = newData;
      this.dataView.data = newData;
      this.dataView.totalRecords = count;
    }
  }

  addUser() {
    this.router.navigate(['/usermanagement/add-user']);
  }

  editUser(gridData) {
    let user_id = this.encDecService.get(gridData.user_id);
    this.router.navigate([`/usermanagement/edit-user/${gridData.user_id}`]);
  }

  filter(data) {
    this.dataView.dataViewTable.filter(data);
  }

  filterByStatus(data) {
    let dataViewData = this.userGridData;
    let filteredData = dataViewData.filter(role => role.status == data);
    this.dataView.data = filteredData
  }

  resetUserPwd(userId: any, passwordType?) {
    this.userManagementService.resetPasswordByAdmin(userId, passwordType)
      .subscribe(r => {
        if (passwordType && passwordType === 'default') {
          this.utilService.showSuccessToast('Default Password set successfully');
        } else {
          this.utilService.showSuccessToast('Password has been re-set successfully');
        }
      });
  }

  updateUsersStatus(user_id: any, user_status: any) {
    this.userManagementService.updateUsersStatus(user_id, user_status).subscribe((res) => {
      if (!res.error) {
        if (user_status == 1) {
          this.utilService.showSuccessToast('User Activated Successfully');
        } else {
          this.utilService.showSuccessToast('User De-Activated Successfully');
        }
        setTimeout(() => {
          const payload = {limit: true};
          this.currentPage = 1;
          this.getUsersList(payload);
        }, 1000);
      }
    });
  }


  mobileNumber;
  deleteUserConfirmation(rowData) {
    this.mobileNumber = rowData.mobile_number;
    Swal.fire({
      title: `Are you sure you want to delete ${rowData.display_name}`,
      showCancelButton: true,
      confirmButtonText: 'Save',
      allowEscapeKey: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser();
      } else if (result.isDismissed) {
        this.mobileNumber = null;
      }
    })
  }

  deleteUser() {
    let payload = { "mobile_number": this.mobileNumber };
    this.userManagementService.deleteUser(payload).subscribe((res) => {
      this.utilService.showSuccessToast("User deleted successfully");
      const payload = {limit: true};
      this.currentPage = 1
      this.getUsersList(payload);
    });
  }

  onCustomPageChangeEvent(event) {
    this.currentPage = event.current_page;
    const payload = {limit: true};
    this.getUsersList(payload);
  }
}
