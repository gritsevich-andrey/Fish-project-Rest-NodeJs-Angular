import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'emailCut'
})
export class EmailCutPipe implements PipeTransform {

  transform(email: string): string {
    return email.split('@')[0]
  }
}
