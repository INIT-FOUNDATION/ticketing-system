import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appMax]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxDirective, multi: true }]
})
export class MaxDirective {

  @Input('appMax') max: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.max ? this.maxValidator(this.max)(control) : null;
  }

  maxValidator(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control && (control.value === '' || control.value === null || control.value === undefined)) {
        return null;
      }

      let validate;
      if (control && (control.value != '' || control.value != null || control.value != undefined) ) {
        const value = Number.parseInt(control.value, 10);
        if (value <= max) {
          validate = true;
        } else {
          validate = false;
        }
      }
      return !validate ? { max: { value: control.value } } : null;
    };
  }

}
