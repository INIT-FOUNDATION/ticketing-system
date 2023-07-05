import { Router } from '@angular/router';
import { UtilsService } from '../../../../modules/shared/services/utils.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';
import { AuthService } from '../../service/auth.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  verificationCodeEnable = false;
  mobileFormEnable = true;
  passwordChangeEnabled = false;
  mobile_number_form: FormGroup;
  otp_form: FormGroup;
  password_form: FormGroup;
  otp = new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
  constructor(private authService: AuthService,
              private encDecService: EncDecService,
              private utilService: UtilsService,
              private router: Router) { }

  ngOnInit(): void {
    this.mobile_number_form = new FormGroup({
      mobile_number: new FormControl(null, [Validators.required])
    });

    this.otp_form = new FormGroup({
      otp: this.otp,
      txnId: new FormControl(null, [Validators.required]),
    });

    this.password_form = new FormGroup({
      new_password: new FormControl(null, [Validators.required]),
      confirm_password: new FormControl(null, [Validators.required, this.confirmPasswordValidator.bind(this)]),
      txnId: new FormControl(null, [Validators.required]),
    });
  }

  verifyMobileNumber() {
    if(this.mobile_number_form.valid) {
      let formData = this.mobile_number_form.getRawValue();
      formData.mobile_number = this.encDecService.set(''+formData.mobile_number);
      this.restartTimer();
      this.authService.verifyMobileNumber(formData).subscribe(res => {
        this.mobileFormEnable = false;
        this.verificationCodeEnable = true;
        this.otp_form.get('txnId').setValue(res.txnId);
      }, (err: HttpErrorResponse)=> {
        if (err.status == 400 && err.error.txnId) {
          this.mobileFormEnable = false;
          this.verificationCodeEnable = true;
          this.otp_form.get('txnId').setValue(err.error.txnId);
        }
      })
    }
  }

  verifyForgotPasswordOtp() {
    if (this.otp_form.valid) {
      let formData = this.otp_form.getRawValue();
      formData.otp = this.encDecService.set(formData.otp);
      formData.new_password = this.encDecService.set(formData.new_password);
      this.authService.verifyForgotPasswordOtp(formData).subscribe(res => {
        this.password_form.get('txnId').setValue(res.txnId);
        this.verificationCodeEnable = false;
        this.passwordChangeEnabled = true;
      })
    }
  }

  resetPassword() {
    if (this.password_form.valid) {
      let formData = this.password_form.getRawValue();
      formData.new_password = this.encDecService.set(formData.new_password);
      formData.confirm_password = this.encDecService.set(formData.confirm_password);
      this.authService.resetPassword(formData).subscribe(res => {
        this.utilService.showSuccessToast('Password resetted successfully');
        this.router.navigate(['/login']);
      })
    }
  }

  confirmPasswordValidator(control:FormControl) {
    if (this.password_form) {
      const confirmPwd = control.value;
      const newPwd = this.password_form.get('new_password').value;

      if (!confirmPwd) {
        return null;
      }

      if (confirmPwd != newPwd) {
        return {password_not_same: true};
      }

      return null;
    }
    return null;
  }

  interval;
  timeLeft = 180;
  timeLeftInMinFormat = "03:00";
  restartTimer() {
    this.clearTimer();
    this.timeLeft = 180;
    this.timeLeftInMinFormat = "03:00";
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        this.timeLeftInMinFormat = new Date(this.timeLeft * 1000).toISOString().substring(14, 19)
      } else {
        this.clearTimer();
      }
    },1000)
  }

  clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}


