import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'translationPrescription'
})
export class TranslationPrescriptionPipe implements PipeTransform {
  when = environment.when;
  frequency = environment.frequency;
  transform(value: string, module: string, lang: string): string {
    let transformedValue = "";
    switch(module) {
      case 'when':
        transformedValue = this.when[value][lang];
        break;
      case 'frequency':
        transformedValue = this.frequency[value][lang];
        break;
    }
    return transformedValue;
  }

}
