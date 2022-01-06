import { Injectable } from '@angular/core';
import {Sort} from "@angular/material/sort";


@Injectable({
  providedIn: 'root'
})
export class SortService {

  sortedData!: any[];
  constructor() { }

  sortData(sort: Sort) {
    if(this.sortedData) {
      this.sortedData.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'email': {
            return this.compare(a.email, b.email, isAsc);
          }
          default: return 0;
        }
      });
    }
  }
  compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
