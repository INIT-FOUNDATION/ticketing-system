import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { PasswordPolicy, PasswordPolicyService } from '../../services/password-policy.service';

@Component({
  selector: 'app-password-policy-form',
  templateUrl: './password-policy-form.component.html',
  styleUrls: ['./password-policy-form.component.scss']
})
export class PasswordPolicyFormComponent implements OnInit {
  passwordPolicyForm: FormGroup;
  buttonLabel = 'Save Password Policy';
  formSubmitted = false;
  id: number;
  passWordComplexityRequirements = [
    {label: 'None'},
    {label: 'Must Contain mix of uppercase (A-Z) and lowercase (a-z) alphabets'},
    {label: 'Must Contain at least one numeric character (0-9)'},
    {label: 'Must Contain at least one of the following special characters (! @ # $ & *)'}
  ];
  constructor(private passwordPolicyService: PasswordPolicyService,
              private utilsService: UtilsService,
              public dataService: DataService) { }

  ngOnInit(): void {
    this.initForm();
    this.getPasswordPolicyData();
  }

  getPasswordPolicyData(): any {
    this.passwordPolicyService.getPasswordPolicy().subscribe(res => {
      const dataKey = 'data';
      if (res[dataKey].length > 0) {
        const passwordPolicyData = res[dataKey][0];
        this.id = passwordPolicyData.id;
        this.buttonLabel = 'Update Password Policy';
        this.passwordPolicyForm.patchValue({
          id: passwordPolicyData.id,
          passwordExpiresIn: passwordPolicyData.password_expiry,
          enforcePasswordHistory: passwordPolicyData.password_history,
          minPasswordLength: passwordPolicyData.min_password_length,
          minInvalidLoginAttempts: passwordPolicyData.max_invalid_attempts
        });
        this.addFormArrayControls(passwordPolicyData);
      } else {
        this.addFormArrayControls();
      }
    });
  }

  initForm(): void {
    this.passwordPolicyForm = new FormGroup({
      id: new FormControl(''),
      passwordExpiresIn: new FormControl('', Validators.required),
      enforcePasswordHistory: new FormControl('', Validators.required),
      minPasswordLength: new FormControl('', Validators.required),
      passwordComplexityReq: new FormArray([], this.atleastOneCheckBoxSelected.bind(this)),
      minInvalidLoginAttempts: new FormControl('', Validators.required)
    });
  }

  atleastOneCheckBoxSelected(checkboxesFormArray: FormArray): any {
    const selectedModules = checkboxesFormArray.value
      .map((v, i) => (v ? this.passWordComplexityRequirements[i] : null))
      .filter(v => v !== null);

    if (selectedModules.length === 0) {
      return {atleastonecheckbox: true};
    }
    return null;
  }

  addFormArrayControls(passwordPolicyData?: PasswordPolicy): void {
    _.each(this.passWordComplexityRequirements, (complexityReq, index) => {
      let control;
      if (passwordPolicyData) {
        let isChecked;
        switch (index) {
          case 0:
            isChecked = passwordPolicyData.complexity === 1 ? false : true;
            control = new FormControl(isChecked);
            break;
          case 1:
            isChecked = passwordPolicyData.alphabetical === 1 ? true : false;
            control = new FormControl(isChecked);
            break;
          case 2:
            isChecked = passwordPolicyData.numeric === 1 ? true : false;
            control = new FormControl(isChecked);
            break;
          case 3:
            isChecked = passwordPolicyData.special_chars === 1 ? true : false;
            control = new FormControl(isChecked);
            break;
        }
      } else {
        if (index === 0) {
          control = new FormControl(true);
        } else {
          control = new FormControl(false);
        }
      }
      (this.passwordPolicyForm.get('passwordComplexityReq') as FormArray).push(control);
    });
  }

  onCheck(event: Event): any {
    const value = event.currentTarget['value'];
    const checked = event.currentTarget['checked'];
    const passWordComplexityArray = (this.passwordPolicyForm.get('passwordComplexityReq') as FormArray);
    if (checked) {
      if (value === '0') {
        _.each(this.passWordComplexityRequirements, (complexityReq, index) => {
          if (index !== 0) {
            const control = new FormControl(false);
            passWordComplexityArray.removeAt(index);
            passWordComplexityArray.insert(index, control);
          }
        });
      } else {
        _.each(this.passWordComplexityRequirements, (complexityReq, index) => {
          if (index === 0) {
            const control = new FormControl(false);
            passWordComplexityArray.removeAt(0);
            passWordComplexityArray.insert(0, control);
            return false;
          }
        });
      }
    } else {
      if (value === '0') {
        const control = new FormControl(true);
        passWordComplexityArray.removeAt(0);
        passWordComplexityArray.insert(0, control);
      } else {
        const data = this.passwordPolicyForm.get('passwordComplexityReq').value;
        const index = _.findIndex(data, b => {
                        return b === true;
                      });
        if (index === -1) {
          const control = new FormControl(true);
          passWordComplexityArray.removeAt(0);
          passWordComplexityArray.insert(0, control);
        }
      }
    }
  }

  get passwordComplexityReqArrayControls(): AbstractControl[] {
    return (this.passwordPolicyForm.get('passwordComplexityReq') as FormArray).controls;
  }

  submit(): void {
    this.formSubmitted = true;
    if (this.passwordPolicyForm.valid) {
      let passwordPolicyObs$: Observable<any>;
      const passwordPolicyFormObj = this.getDataFromPasswordPolicyForm();
      if (this.id) {
        passwordPolicyFormObj.id = this.id;
        passwordPolicyObs$ = this.passwordPolicyService.updatePasswordPolicy(passwordPolicyFormObj);
      } else {
        passwordPolicyObs$ = this.passwordPolicyService.createPasswordPolicy(passwordPolicyFormObj);
      }
      passwordPolicyObs$.subscribe((res) => {
        this.formSubmitted = false;
        if (this.id) {
          this.utilsService.showSuccessToast('Password Policy Updated Successfully');
        } else {
          this.id = res.data;
          this.buttonLabel = 'Update Password Policy';
          this.utilsService.showSuccessToast('Password Policy Created Successfully');
        }
      }, err => {
        this.formSubmitted = false;
        console.error(err);
      });
    }
  }

  getDataFromPasswordPolicyForm(): PasswordPolicy {
    const passwordComplexityReqData = this.passwordPolicyForm.get('passwordComplexityReq').value;
    const formData = this.passwordPolicyForm.getRawValue();
    const postData: PasswordPolicy = {
      password_expiry: ''+formData.passwordExpiresIn,
      password_history: ''+formData.enforcePasswordHistory,
      min_password_length: ''+formData.minPasswordLength,
      allowed_special_chars: '!@#$&*',
      max_invalid_attempts: ''+formData.minInvalidLoginAttempts,
      complexity: passwordComplexityReqData[0] ? '0' : '1',
      alphabetical: passwordComplexityReqData[1] ? '1' : '0',
      numeric: passwordComplexityReqData[2] ? '1' : '0',
      special_chars: passwordComplexityReqData[3] ? '1' : '0',
    };

    return postData;
  }

}
