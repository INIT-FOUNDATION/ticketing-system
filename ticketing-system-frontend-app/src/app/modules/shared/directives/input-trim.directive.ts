import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appInputTrim]',
  providers: [{ provide: NG_VALIDATORS, useExisting: InputTrimDirective, multi: true }]
})
export class InputTrimDirective {

  validate(control: AbstractControl): { [key: string]: any } | null {
    return InpuTrimValidator()(control);
  }
}
export function InpuTrimValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control && (control.value === '' || control.value === null || control.value === undefined)) {
      return null;
    }

    if (!control.value?.replace(/\s/g, '').length) {
      return {
        trimError: { value: 'Whitespace not allowed' }
      };
    }
    return null;
  };
}
