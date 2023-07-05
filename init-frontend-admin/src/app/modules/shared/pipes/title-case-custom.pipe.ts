import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCaseCustom'
})
export class TitleCaseCustomPipe implements PipeTransform {

  transform(value: string): string {
    let returnString = '';
    if (value) {
      const splitString = value.split(" ");
      var final = [];
      for(var i=0; i< splitString.length; i++) {
          var d = splitString[i];

          if (d) {
            try {
              var c = d[0].toUpperCase()+d.substring(1, d.length)
              final.push(c);
            } catch(e) {
              console.log('--------');
              console.log(d);
              console.log('--------');
            }
          }
      }
      returnString = final.join(' ');
    }
    return returnString;
  }

}
