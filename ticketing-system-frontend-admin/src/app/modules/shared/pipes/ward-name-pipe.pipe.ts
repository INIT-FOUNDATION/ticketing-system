import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wardNamePipe'
})
export class WardNamePipePipe implements PipeTransform {

  transform(ward_id: number, wardsList: any[]): string {
    if(ward_id) {
      let ward = wardsList.find(ward => ward.ward_id == ward_id);
      return ward ? ward.ward_name : "";
    }

    return "";
  }

}
