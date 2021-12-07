import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'duplicate'
})
export class DuplicatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let uniqueArray: any[] = [];
    value.forEach((obj: any) => {
      for (let objKey in obj)
      {
          uniqueArray.push(obj['title']);
        }
    });
    return   [...new Set(uniqueArray)];
  }
}
