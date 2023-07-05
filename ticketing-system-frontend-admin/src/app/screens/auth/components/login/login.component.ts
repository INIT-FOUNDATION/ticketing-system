import { UtilsService } from '../../../../modules/shared/services/utils.service';
import { DataService } from '../../../../modules/shared/services/data.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/modules/shared/services/common.service';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formSubmitted = false;
  loginForm: FormGroup;
  patientLoginForm: FormGroup;
  togglePassword = true;
  verificationCodeEnable = false;
  otp = new FormControl(null, [Validators.required])
  constructor(private authService: AuthService,
              private encDecService: EncDecService,
              private commonService: CommonService,
              private router: Router,
              private dataService: DataService,
              private utilityService: UtilsService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      user_name: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });

    this.patientLoginForm = new FormGroup({
      mobile: new FormControl(null, [Validators.required]),
      txnId: new FormControl(null, [Validators.required]),
      otp: this.otp
    })
  }

  login() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      let loginDetails = this.loginForm.getRawValue();
      loginDetails.password = this.encDecService.set(loginDetails.password);
      this.authService.login(loginDetails).subscribe(res => {
        this.formSubmitted = false;
        sessionStorage.setItem('userToken', JSON.stringify(res));
        this.commonService.getUserDetails(res);
        this.commonService.postLoginUserUpdate(loginDetails.user_name);
      });
    }
  }


  patientLoginMobileSubmit() {
    if (this.patientLoginForm.get('mobile').valid) {
      let formData = this.patientLoginForm.getRawValue();
      this.authService.generatePatientOtp({mobile: formData.mobile}).subscribe((res: any) => {
        this.verificationCodeEnable = !this.verificationCodeEnable
        this.patientLoginForm.get('txnId').setValue(res.txnId);
      })
    }
  }

  patientLoginOTPSubmit() {
    if (this.patientLoginForm.get('otp').valid) {
      let formData = this.patientLoginForm.getRawValue();
      this.authService.verifyPatientOtp({otp: formData.otp, txnId: formData.txnId}).subscribe((res: any) => {
        sessionStorage.setItem('userToken', JSON.stringify(res.token));
        this.commonService.getUserDetails(res);
      })
    }
  }

  hospitalOnBoarding() {
    this.router.navigate(['/hospital-boarding'])
  }

}
