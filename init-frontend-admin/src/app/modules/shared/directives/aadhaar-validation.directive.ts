import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[aadhaarValid]',
  providers: [{ provide: NG_VALIDATORS, useExisting: AadhaarNumberValidationDirective, multi: true }]
})
export class AadhaarNumberValidationDirective {

  validate(control: AbstractControl): { [key: string]: any } | null {
    return AadhaarValidation()(control);
  }
}
export function AadhaarValidation(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control && (control.value === '' || control.value === null || control.value === undefined)) {
      return null;
    }

    if (control.value.length === 0) {
      return {
        notValidAadhaar: { value: 'Aadhaar Number Is Not Valid' }
      };
    }else if (control.value.length !== 12 && control.value.length !== 16) {
      return {
        notValidAadhaar: { value: 'Aadhaar Number Is Not Valid' }
      };
    }

    var Verhoeff = {
      "d": [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
          [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
          [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
          [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
          [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
          [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
          [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
          [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
          [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]],
      "p": [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
          [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
          [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
          [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
          [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
          [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
          [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]],
      "j": [0, 4, 3, 2, 1, 5, 6, 7, 8, 9],
      "check": function (str: any)
      {
          var c = 0;
          str.replace(/\D+/g, "").split("").reverse().join("").replace(/[\d]/g, function (u: any, i: any) {
              c = Verhoeff.d[c][Verhoeff.p[i % 8][parseInt(u, 10)]];
          });
          return c;

      },
      "get": function (str: any) {

          var c = 0;
          str.replace(/\D+/g, "").split("").reverse().join("").replace(/[\d]/g, function (u: any, i: any) {
              c = Verhoeff.d[ c ][ Verhoeff.p[(i + 1) % 8][parseInt(u, 10)] ];
          });
          return Verhoeff.j[c];
      }
    };

    if (Verhoeff['check'](control.value) === 0) {
      return null;
    } else {
      return {
        notValidAadhaar: { value: 'Aadhaar Number Is Not Valid' }
      };
    }
  };
}
