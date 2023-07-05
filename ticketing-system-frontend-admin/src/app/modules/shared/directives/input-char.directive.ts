import { Directive, Input, HostListener } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appInputChar]',
  providers: [{ provide: NG_VALIDATORS, useExisting: InputCharDirective, multi: true }]
})
export class InputCharDirective {

  @Input('appInputChar') appInputChar: string | undefined;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.appInputChar ? InputCharValidator(this.appInputChar)(control) : null;
  }
}
export function InputCharValidator(inputCharVal: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {

    if (control && (control.value === '' || control.value === null || control.value === undefined)) {
      return null;
    }
    // location facility name Validation (Allow only “.”,  “-“,  “( )”  , “/” ,”0-9”, “a-z”, “A-Z”)
    const locAndFacilityRegex = /^[ A-Za-z0-9/.\-()]*$/;
    // User Names Field Validation (Allow only  “.”,  “-“,  “( )”, “a-z”, “A-Z”)
    const usernameRegex = /^[ A-Za-z.\-()]*$/;

    // Street Name Field Validation (Allow only “.”,  “,”, “-“,  “( )”  ,”0-9”, “a-z”, “A-Z”)
    const streetRegex = /^[ A-Za-z0-9.,\-():,;]*$/;

    // location facility name Validation (Allow only “.”,  “-“,  “( )”  ,”0-9”, “a-z”, “A-Z”)
    const templateManageRegex = /^[ A-Za-z0-9.\-_()]*$/;

    // Role name facility name Validation (Allow only “.”,  “-“,  “( )”  , “&” ,”0-9”, “a-z”, “A-Z”)
    const roleNameRegex = /^[ A-Za-z0-9/.\-\&()]*$/;

    // location facility name Validation (Allow only “.”,  “-“,  “( )”  ,”0-9”, “a-z”, “A-Z”)
    const beneficiaryRegex = /^[ A-Za-z0-9.\-()]*$/;
    // location facility name Validation (Allow only “.”,  “-“, “/“ , “( )”  ,”0-9”, “a-z”, “A-Z”)
    const beneficiaryIdRegex = /^[ A-Za-z0-9/.,\-()]*$/;
    // id number Validation (Allow only “.”,  “-“, “/“ , “( )”  ,”0-9”, “a-z”, “A-Z”)
    const idRegex = /^[ A-Za-z0-9.-]*$/;
    // id number Validation (Allow only “.”,  “-“, “/“ , “( )”  ,”0-9”, “a-z”, “A-Z”)
    const nameRegex = /^[ A-Za-z]*$/;
    // passport number Validation
    // const passportCard = /^[A-Z]{1,4}[0-9]{5,7}$/;
    const passportCard = /^[A-Z0-9]*$/;
    // pan card number Validation
    const pancard = /^[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$/;
    // pincode regex validation
    const pincode = /^[1-9][0-9]{5}$/;
    // dl regex validation
    const drivingLicence = /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}[0-9]{2}))((19|20)[0-9][0-9])[0-9]{6,7}$/;
    // alphanumb
    const alphaNum = /^[ A-Za-z0-9/.,\-]*$/;
    // UUID
    const uuIdNumber = /^[a-zA-Z]{2}\d{16}$/;
    // Alpha Num
    const alphaNumRegex = /^[ A-Za-z0-9]*$/;

    const emailIdRegex = /\S+@\S+\.\S+/;

    let validate;
    if (control && control.value) {
      if (inputCharVal === 'locAndFacility'){
        validate = locAndFacilityRegex.test(control.value);
      } else if (inputCharVal === 'username') {
        validate = usernameRegex.test(control.value);
      } else if (inputCharVal === 'street') {
        validate = streetRegex.test(control.value);
      } else if (inputCharVal === 'template') {
        validate = templateManageRegex.test(control.value);
      } else if (inputCharVal === 'roleName') {
        validate = roleNameRegex.test(control.value);
      } else if (inputCharVal === 'name') {
        validate = nameRegex.test(control.value)
      } else if (inputCharVal === 'idproof') {
        validate = beneficiaryIdRegex.test(control.value);
      } else if (inputCharVal === 'idnumber') {
        validate = idRegex.test(control.value);
      } else if (inputCharVal === 'passportnumber') {
        validate = passportCard.test(control.value);
      } else if (inputCharVal === 'pancard') {
        validate = pancard.test(control.value);
      } else if (inputCharVal == 'pincode') {
        validate = pincode.test(control.value);
      } else if (inputCharVal == 'dlnumber') {
        validate = drivingLicence.test(control.value);
      } else if (inputCharVal == 'alphanum') {
        validate = alphaNum.test(control.value);
      } else if (inputCharVal == 'uuIdNo') {
        validate = uuIdNumber.test(control.value);
      } else if (inputCharVal === 'onlyAlphaNum') {
        validate = alphaNumRegex.test(control.value);
      } else if (inputCharVal === 'beneficiary') {
        validate = beneficiaryRegex.test(control.value);
      } else if (inputCharVal == 'email') {
        validate = emailIdRegex.test(control.value);
      } else {
        validate = false;
      }
      // validate = locAndFacilityRegex.test("sdsgs.sdfs") control.value.length >= rangeVal[0] && control.value.length <= rangeVal[1];
    }
    return !validate ? { inputcharvalidator: { value: control.value } } : null;
  };
}
