import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'duplicate'
})
export class DuplicatePipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    console.log('Входные параметры', value);
    console.log('Тип входного параметра',typeof(value));
    let uniqueArray = Array.from(new Set(value));
    console.log('Переработка', uniqueArray);
    return uniqueArray;
  }
}
