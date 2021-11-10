import { Component, OnInit } from '@angular/core';
import {SortService} from "../../shared/services/sort.service";

declare var M: { FormSelect: { init: (arg0: NodeListOf<Element>) => any; }; }
@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements OnInit {
  page = 1;
  constructor(public sortService: SortService) { }

  ngOnInit(): void {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }

}
