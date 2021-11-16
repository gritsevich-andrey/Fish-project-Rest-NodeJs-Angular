import {BehaviorSubject, Observable, Subject} from "rxjs";

export type Actions = 'CREATE' | 'DELETE' | 'UPDATE';
// @Injectable(
//   {
//     providedIn: 'root'
//   }
// )
export class EmitterService {
  eventEmitterSubject$ = new Subject<{ action: Actions, payload?: any }>();
  private change: Subject<number> = new Subject<number>();
  change$: Observable<number> = this.change.asObservable();
  private state: number = 0;
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);
  constructor() {
    this.change$.subscribe(state => console.log(state));
    this.setState(1)
  }


  setState(state: number) {
    this.state = state;
    this.change.next(this.state);
  }
  changeAuthenticated() {
    // broadcast true to all subscribers
    this.isAuthenticated$.next(true);
  }
}
