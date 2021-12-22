import {Component, OnInit} from '@angular/core';
import {Sort} from "@angular/material/sort";
import {TravelService} from "../shared/services/travel.service";
import {ChatDialogComponent} from "../../site-pages/map-travel/list-descriptions/chat-dialog/chat-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {TripComponent} from "./trip/trip.component";

export interface Travels {
  npp: number;
  name: string;
  description: number;
  // @ts-ignore
  joinedUsers: string[{ fio: string, name: string }];
  date: string;
  _id: string;
}

@Component({
  selector: 'app-travels',
  templateUrl: './travels.component.html',
  styleUrls: ['./travels.component.scss']
})
export class TravelsComponent implements OnInit {
  travels: Travels[] = [];
//@ts-ignore
  sortedData: Travels[];
  textDesc = '';

  constructor(private travelService: TravelService,
              public dialog: MatDialog) {
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
        case 'name':
          return compare(a.name, b.name, isAsc);
        // case 'joinedUsers':
        //   return compare(a.joinedUsers, b.joinedUsers, isAsc);
        case 'description':
          return compare(a.description, b.description, isAsc);
        default:
          return 0;
      }
    });
  }

  openDialog(_id: string) {
    const travels = JSON.parse(JSON.stringify(this.travels));

    const filteredTravels = travels.filter((data: Travels) => {
      return data._id === _id;
    });
    const dialogRef = this.dialog.open(TripComponent,
      {
        data: filteredTravels
      }
    );
    dialogRef.afterClosed().subscribe();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
