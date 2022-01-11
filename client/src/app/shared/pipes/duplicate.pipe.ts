import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'duplicate'
})
export class DuplicatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let uniqueArray: any[] = [];
    value.forEach((obj: any) => {
      console.log('Значение пайпа', value);
      for (let objKey in obj)
      {
          uniqueArray.push(obj['title']);
        }
    });
    console.log('уникальный пайп', [...new Set(uniqueArray)]);
    return   [...new Set(uniqueArray)];
  }
}
