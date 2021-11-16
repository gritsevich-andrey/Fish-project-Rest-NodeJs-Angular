import {EventEmitter, Injectable, Output} from '@angular/core';


@Injectable()
export class EmitterService {
  @Output() onHide$: EventEmitter<any> = new EventEmitter();
}
