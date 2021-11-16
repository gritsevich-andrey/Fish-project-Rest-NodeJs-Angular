import { Component, OnInit } from '@angular/core';
import {SortService} from "../../shared/services/sort.service";
import {EmitterService} from "../../shared/services/emitter.service";

declare var M: { FormSelect: { init: (arg0: NodeListOf<Element>) => any; }; }
@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements OnInit {
  page = 1;
  constructor(public sortService: SortService, private emitterService: EmitterService ) { }

  ngOnInit(): void {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
    this.emitterService.change$.subscribe(state => console.log('подписка в поездках', state));
    this.emitterService.isAuthenticated$.subscribe(authenticated => {
      if (authenticated) {
        console.log('Аутентификация в поездках')
      }
    });
  }

}
