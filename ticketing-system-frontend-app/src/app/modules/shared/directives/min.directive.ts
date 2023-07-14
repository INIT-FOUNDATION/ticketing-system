import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appMin]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinDirective, multi: true }]
})
export class MinDirective {

  @Input('appMin') min: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.min ? this.minValidator(this.min)(control) : null;
  }

  minValidator(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control && (control.value === '' || control.value === null || control.value === undefined)) {
        return null;
      }

      let validate;
      if (control && (control.value != '' || control.value != null || control.value != undefined)) {
        const value = Number.parseInt(control.value, 10);
        if (value >= min) {
          validate = true;
        } else {
          validate = false;
        }
      }
      return !validate ? { min: { value: control.value } } : null;
    };
  }

}
