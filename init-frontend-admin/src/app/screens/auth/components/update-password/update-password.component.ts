import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  updatePasswordForm: FormGroup;
  constructor(private authService: AuthService,
              private encDecService: EncDecService,
              private utilService: UtilsService,
              private router: Router) { }

  ngOnInit(): void {
    this.updatePasswordForm = new FormGroup({
      currentPassword: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required])
    })
  }

  resetPassword() {
    if (this.updatePasswordForm.valid) {
      let formData = this.updatePasswordForm.getRawValue();
      formData.currentPassword = this.encDecService.set(formData.currentPassword);
      formData.newPassword = this.encDecService.set(formData.newPassword);
      formData.userId = this.encDecService.set(this.authService.userId);
      this.authService.updatePassword(formData).subscribe(res => {
        this.utilService.showSuccessToast('Password updated successfully');
        this.router.navigate(['/login']);
      })
    }
  }

}
