import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'languageName'
})
export class LanguageNamePipe implements PipeTransform {

  transform(lang_ids: number[], language_list: any[]): string {
    let language_name = '';
    if (lang_ids && lang_ids.length > 0 && language_list && language_list.length > 0) {
      let lang_names = [];
      lang_ids.forEach(lang_id => {
        let language = language_list.find(obj => obj.language_id == lang_id);
        lang_names.push(language.language_name);
      })
      language_name = lang_names.join(',');
    }
    return language_name;
  }

}
