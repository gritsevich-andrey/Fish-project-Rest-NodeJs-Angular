import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'space'
})
export class SpacePipe implements PipeTransform {

  transform(value: string[], ...args: string[]): string[] {
    let arrayWithSpace: string[] = [];
    value.forEach(data => {
    const splitData =  data.split(',');
        splitData.forEach(value1 => {
      const newStr = ' ' + value1;
      arrayWithSpace.push(newStr);
    })
    })
    return arrayWithSpace;
  }

}
