import { AppPreferencesService } from './../../../../modules/shared/services/preferences.service';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { fromEvent, Observable } from 'rxjs';
import { ToastrService } from 'src/app/modules/shared/services/toastr.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  infoHeading = 'Welcome Back! ';
  infoSubHeading = 'Sign in to continue.';
  showOTPToggle = false;
  showPINToggle = false;
  showSetPINToggle = false;
  showForgotPassword: boolean = false;
  mobileForm: FormGroup;
  otpForm: FormGroup;
  pinForm: FormGroup;
  setPinForm: FormGroup;
  otpFrmCtrl = new FormControl(null, [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
  ]);
  pinFrmCtrl = new FormControl(null, [
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
  showFooter = true;
  timeLeft: number = 180;
  timeLeftInMinFormat = '03:00';
  interval;
  countryCodes: any = [];
  selectedCountryName: any;
  selectedDialCode: any;
  constructor(
    private router: Router,
    private platform: Platform,
    private authService: AuthService,
    private toastrService: ToastrService,
    private navController: NavController,
    public utilityService: UtilityService,
    private appPreferences: AppPreferencesService
  ) {
    fromEvent(window, 'keyboardWillShow').subscribe(() => {
      this.showFooter = false;
    });

    fromEvent(window, 'keyboardWillHide').subscribe(() => {
      this.showFooter = true;
    });

    fromEvent(window, 'keyboardDidShow').subscribe(() => {
      this.showFooter = false;
    });

    fromEvent(window, 'keyboardDidHide').subscribe(() => {
      this.showFooter = true;
    });
  }

  ngOnInit() {
    this.initForm();
    // this.getCountryDialCodes();
    this.platform.keyboardDidShow.subscribe((ev) => {
      this.showFooter = false;
    });

    this.platform.keyboardDidHide.subscribe((ev) => {
      this.showFooter = true;
    });
  }

  initForm() {
    this.mobileForm = new FormGroup({
      mobile_number: new FormControl(null, [
        Validators.required,
        Validators.maxLength(14),
        Validators.minLength(6),
      ]),
      dial_code: new FormControl(1, [Validators.required]),
      country_code: new FormControl('IN', [Validators.required]),
    });

    this.otpForm = new FormGroup({
      otp: this.otpFrmCtrl,
      txnId: new FormControl(null, [Validators.required]),
    });

    this.pinForm = new FormGroup({
      pin: this.pinFrmCtrl,
    });

    this.setPinForm = new FormGroup({
      pin: this.new_pinFrmCtrl,
      confirm_pin: this.confirm_pinFrmCtrl,
      pin_txn_id: new FormControl(null, [Validators.required]),
    });
  }

  selectedCountryCode(value) {
    this.selectedDialCode = value.dial_code;
    this.selectedCountryName = value.country_code;
    this.mobileForm.get('country_code').setValue(this.selectedCountryName);
  }

  getOtp() {
    let formData = this.mobileForm.getRawValue();
    formData.dial_code = this.selectedDialCode ? this.selectedDialCode : 91;
    formData.country_code = this.selectedCountryName
      ? this.selectedCountryName
      : 'IN';
    this.authService.generateOtp(formData).subscribe((res: any) => {
      if (res.pin_configured) {
        this.infoHeading = 'Enter Your Pin';
        this.infoSubHeading = 'Please enter the 6 digit PIN';
        this.showPINToggle = true;
      } else {
        this.restartTimer();
        this.otpForm.get('txnId').setValue(res.txnId);
        this.showOTPToggle = true;
        this.infoHeading = 'Get Your Code';
        this.infoSubHeading = `Please enter the 6 digit code sent to your mobile number +91 ${formData.mobile_number}`;
      }
    });
  }

  verifyOtp() {
    if (this.otpForm.valid) {
      let formData = this.otpForm.getRawValue();
      this.authService.validateOtp(formData).subscribe((res: any) => {
        this.showOTPToggle = false;
        this.showSetPINToggle = true;
        this.infoHeading = 'Set Your Pin';
        this.infoSubHeading = 'Please set the 6 digit PIN';
        this.setPinForm.get('pin_txn_id').setValue(res.pin_txn_id);
      });
    }
  }

  verifyPin() {
    if (this.pinForm.valid) {
      let formData = this.mobileForm.getRawValue();
      let pinFormData = this.pinForm.getRawValue();
      let payload = { ...formData, ...pinFormData };
      this.authService.loginByPin(payload).subscribe(async (res: any) => {
        this.authService.currentUserSubject.next(res.token);
        this.appPreferences.setValue('userToken', JSON.stringify(res.token));
        this.navController.navigateRoot(['/home/doctor-search']);
      });
    }
  }

  setPin() {
    if (this.setPinForm.valid) {
      let formData = this.setPinForm.getRawValue();
      this.authService.setPin(formData).subscribe((res: any) => {
        this.authService.currentUserSubject.next(res.token);
        this.appPreferences.setValue('userToken', JSON.stringify(res.token));
        this.navController.navigateRoot(['/home/doctor-search']);
      });
    }
  }

  back() {
    this.infoHeading = 'Welcome Back! ';
    this.infoSubHeading = 'Sign in to continue.';
    this.showOTPToggle = false;
    this.showPINToggle = false;
    this.showSetPINToggle = false;
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

  resetPin() {
    let data = this.mobileForm.getRawValue();
    this.router.navigate([`login/reset-pin/${data.mobile_number}`]);
  }

  signUpForm() {
    this.router.navigate([`sign-up`]);
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

  forgotPassword() {
    this.showForgotPassword = true;
  }

  getCountryDialCodes() {
    this.authService.getCountryCode().subscribe((res) => {
      let countryDataArray: any = res;
      this.countryCodes = countryDataArray.filter((x: any) => {
        if (x.country_code == null) {
          return false;
        } else {
          return true;
        }
      });
    });
  }
}
