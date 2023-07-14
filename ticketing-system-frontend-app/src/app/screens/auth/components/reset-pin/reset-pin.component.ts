import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/modules/shared/services/toastr.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-pin',
  templateUrl: './reset-pin.component.html',
  styleUrls: ['./reset-pin.component.scss'],
})
export class ResetPinComponent implements OnInit {
  mobile_number;
  infoHeading = 'Get Your Code';
  infoSubHeading = 'Enter the code we’ve sent to';
  showSetPINToggle = false;
  mobileForm: FormGroup;
  setPinForm: FormGroup;
  otpFrmCtrl = new FormControl(null, [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
  ]);
  new_pinFrmCtrl = new FormControl(null, [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
  ]);
  confirm_pinFrmCtrl = new FormControl(null, [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    this.confirmPinValidator(this.new_pinFrmCtrl).bind(this),
  ]);
  timeLeft: number = 180;
  timeLeftInMinFormat = '03:00';
  interval;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService,
    public utilityService: UtilityService
  ) {
    this.mobile_number = activatedRoute.snapshot.params.mobile_number;
    if (!this.mobile_number) {
      this.back();
    }
  }

  ngOnInit() {
    this.initForm();
    this.getOtp();
  }

  getOtp() {
    this.authService
      .getResetPinOTP({ mobile_number: this.mobile_number })
      .subscribe((res: any) => {
        this.restartTimer();
        this.mobileForm.get('txnId').setValue(res.txnId);
      });
  }

  initForm() {
    this.mobileForm = new FormGroup({
      mobile_number: new FormControl({
        value: this.mobile_number,
        disabled: true,
      }),
      otp: this.otpFrmCtrl,
      txnId: new FormControl(null, [Validators.required]),
    });

    this.setPinForm = new FormGroup({
      pin: this.new_pinFrmCtrl,
      confirm_pin: this.confirm_pinFrmCtrl,
      pin_txn_id: new FormControl(null, [Validators.required]),
    });
  }

  verifyOtp() {
    if (this.mobileForm.valid) {
      let formData = this.mobileForm.getRawValue();
      delete formData.mobile_number;

      this.authService.verifyResetPinOTP(formData).subscribe((res: any) => {
        this.setPinForm.get('pin_txn_id').setValue(res.pin_txn_id);
        this.showSetPINToggle = true;
        this.infoHeading = 'Set Your Pin';
        this.infoSubHeading = 'Please set the 6 digit PIN';
      });
    }
  }

  resetPin() {
    if (this.setPinForm.valid) {
      let formData = this.setPinForm.getRawValue();
      this.authService.resetPin(formData).subscribe((res) => {
        this.toastrService.presentSuccessToast(
          'bottom',
          'Pin resetted successfully'
        );
        this.back();
      });
    }
  }

  back() {
    this.router.navigate(['/login']);
  }

  confirmPinValidator(new_pinFrmCtrl: FormControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const compare_value = new_pinFrmCtrl.value;
      if (!value) {
        return null;
      }

      if (value != compare_value) {
        return { not_same: true };
      }
      return null;
    };
  }

  restartTimer() {
    this.clearTimer();
    this.timeLeft = 180;
    this.timeLeftInMinFormat = '03:00';
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.timeLeftInMinFormat = new Date(this.timeLeft * 1000)
          .toISOString()
          .substring(14, 19);
      } else {
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
