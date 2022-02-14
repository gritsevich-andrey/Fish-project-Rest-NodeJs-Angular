import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutImageName'
})
export class CutImageNamePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(!value) return ''
    if (value.length > 20) {
      const arr = value.split('.')
      const firstPart = arr[0].split('').slice(0, 5).join('')
      const secondPart = arr[arr.length-2].split('').slice(-5).join('')

      return firstPart + '...' + secondPart + '.' + arr[arr.length-1]
    } else {
      return value
    }
  }

}
