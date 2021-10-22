import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args) {
      return value.filter((el: any) => {
        return el.email.toLowerCase().match(args.toLowerCase()) || el.fio?.toLowerCase().match(args.toLowerCase())
      })
    } else {
      return value
    }
  }

}
