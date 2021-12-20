import {Component, OnInit} from '@angular/core';
import {Sort} from "@angular/material/sort";
import {TravelService} from "../shared/services/travel.service";

export interface Travels {
  npp: number;
  userEmail: string;
  description: number;
  // @ts-ignore
  joinedUsers: string[{fio: string, userEmail: string}];
  date: string;
}

@Component({
  selector: 'app-travels',
  templateUrl: './travels.component.html',
  styleUrls: ['./travels.component.scss']
})
export class TravelsComponent implements OnInit {
  travels: Travels[] = [
    // {date: 'Frozen yogurt', userEmail: '159', joinedUsers: 6, description: 24},
    // {date: 'Ice cream sandwich', userEmail: 237, joinedUsers: 9, description: 37},
    // {date: 'Eclair', userEmail: 262, joinedUsers: 16, description: 24},
    // {date: 'Cupcake', userEmail: 305, joinedUsers: 4, description: 67},
    // {date: 'Gingerbread', userEmail: 356, joinedUsers: 16, description: 49},
  ];
//@ts-ignore
  sortedData: Travels[];
  textDesc = '';

  constructor(private travelService: TravelService) {
    // this.sortedData = this.travels.slice();
  }

  ngOnInit(): void {
    this.travelService.getTravels().subscribe(data => {
      data.map((value: any) => {
        this.travels.push(value);
      })
      this.sortedData = this.travels.slice();
    });
  }

  sortData(sort: Sort) {
    const data = this.travels.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'npp':
          return compare(a.npp, b.npp, isAsc);
        case 'date':
          return compare(a.date, b.date, isAsc);
        case 'userEmail':
          return compare(a.userEmail, b.userEmail, isAsc);
        // case 'joinedUsers':
        //   return compare(a.joinedUsers, b.joinedUsers, isAsc);
        case 'description':
          return compare(a.description, b.description, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
