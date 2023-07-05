import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[ageRange]',
})
export class AgeRangeDirective {

  @Input('ageRange') range: number[] | undefined;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.range ? this.ageValidator(this.range[0], this.range[1])(control) : null;
  }

  ageValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control && (control.value === '' || control.value === null || control.value === undefined)) {
        return null;
      }

      let validate;
      if (control && control.value) {
        const length = control.value.length;
        if (control.value >= min && control.value <= max) {
          validate = true;
        } else {
          validate = false;
        }
      }
      return !validate ? { age: { value: control.value } } : null;
    };
  }

}
