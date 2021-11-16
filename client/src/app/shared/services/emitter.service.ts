import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

export type Actions = 'CREATE' | 'DELETE' | 'UPDATE';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {
  eventEmitterSubject$ = new Subject<{ action: Actions, payload?: any }>();

  public changeCount(count: { action: Actions, payload?: any }) {
    this.eventEmitterSubject$.next(count);
    console.log('Передали событие в сервис', count);
  }
}
