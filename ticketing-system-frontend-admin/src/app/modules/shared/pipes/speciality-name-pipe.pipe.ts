import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'specialityName'
})
export class SpecialityNamePipe implements PipeTransform {

  transform(spec_ids: number[], speciality_list: any[]): string {
    let speciality_name = '';
    if (spec_ids && spec_ids.length > 0 && speciality_list && speciality_list.length > 0) {
      let spec_names = [];
      spec_ids.forEach(spec_id => {
        let speciality = speciality_list.find(obj => obj.hosp_dept_map_id == spec_id);
        spec_names.push(speciality.dept_name);
      })
      speciality_name = spec_names.join(',');
    }
    return speciality_name;
  }

}
