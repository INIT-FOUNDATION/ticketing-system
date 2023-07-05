import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appRange]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RangeDirective, multi: true }]
})
export class RangeDirective {

  @Input('appRange') range: number[] | undefined;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.range ? this.rangeValidator(this.range[0], this.range[1])(control) : null;
  }

  rangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control && (control.value === '' || control.value === null || control.value === undefined)) {
        return null;
      }

      let validate;
      if (control && !isNaN(control.value)) {
        const value = Number.parseFloat(control.value);
        if (value >= min && value <= max) {
          validate = true;
        } else {
          validate = false;
        }
      }
      return !validate ? { range: { value: control.value } } : null;
    };
  }

}
