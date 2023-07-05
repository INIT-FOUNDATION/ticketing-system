import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appRangeLength]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RangeLengthDirective, multi: true }]
})
export class RangeLengthDirective {

  @Input('appRangeLength') range: number[];

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.range ? this.rangeLengthValidator(this.range[0], this.range[1])(control) : null;
  }

  rangeLengthValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control && (control.value === '' || control.value === null || control.value === undefined)) {
        return null;
      }

      let validate;
      if (control && control.value) {
        const length = control.value.length;
        if (length >= min && length <= max) {
          validate = true;
        } else {
          validate = false;
        }
      }
      return !validate ? { rangeLength: { value: control.value } } : null;
    };
  }
}
