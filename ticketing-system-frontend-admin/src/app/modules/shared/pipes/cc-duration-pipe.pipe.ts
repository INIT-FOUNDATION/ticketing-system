import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ccDurationPipe'
})
export class CcDurationPipePipe implements PipeTransform {

  transform(duration: {years: number, months: number, days: number}): string {
    let duration_in_string = '';
    if (duration.years) {
      duration_in_string = `${duration.years} Years `;
    }

    if (duration.months) {
      duration_in_string = `${duration_in_string}${duration.months} Months `;
    }

    if (duration.days) {
      duration_in_string = `${duration_in_string}${duration.days} Days`;
    }
    return duration_in_string;
  }

}
