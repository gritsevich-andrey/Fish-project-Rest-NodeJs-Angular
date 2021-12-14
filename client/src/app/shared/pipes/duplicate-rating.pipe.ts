import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'duplicateRating'
})
export class DuplicateRatingPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let uniqueArray: any[] = [];
    value.forEach((obj: any) => {
      for (let objKey in obj)
      {
        uniqueArray.push(obj['travelName']);
      }
    });
    return   [...new Set(uniqueArray)];
  }

}
