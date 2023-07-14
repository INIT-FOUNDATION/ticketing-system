import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(gender_id: number, genders: any[]): string {
    let gender_name = null;
    if (gender_id && genders && genders.length > 0) {
      gender_name = genders.find(gender => gender.gender_id == gender_id).gender_name;
    }
    return gender_name;
  }

}
