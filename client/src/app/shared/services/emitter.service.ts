import {BehaviorSubject, Observable, Subject} from "rxjs";

export class EmitterService {
  private change: Subject<number> = new Subject<number>();
  change$: Observable<number> = this.change.asObservable();
  private state: number = 0;
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);
  constructor() {
    this.change$.subscribe();
    this.setState(1)
  }


  setState(state: number) {
    this.state = state;
    this.change.next(this.state);
  }
  changeAuthenticated() {
    this.isAuthenticated$.next(true);
  }
}
