import {Component, OnInit} from '@angular/core';
import {Sort} from "@angular/material/sort";
import {TravelService} from "../shared/services/travel.service";
import {MatDialog} from "@angular/material/dialog";
import {TripComponent} from "./trip/trip.component";
import {DeleteDialogComponent} from "./delete-dialog/delete-dialog.component";

export interface Travels {
  npp: number;
  name: string;
  userFIO: string;
  description: number;
  // @ts-ignore
  joinedUsers: string[{ fio: string, name: string }];
  date: string;
  userEmail: string;
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
  textDesc: string[] = [];

  constructor(private travelService: TravelService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.travelService.getTravels().subscribe(data => {
      data.map((value: any) => {
        console.log('Значение', value);
        this.travels.push(value);
      })
      console.log('Поездки', this.travels);
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
        case 'userFIO':
          return compare(a.userFIO, b.userFIO, isAsc);
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

  sendInChat(travelId: string) {
    const travels = JSON.parse(JSON.stringify(this.travels));
    const filteredTravels= travels.filter((data: Travels) => {
      return  data._id === travelId;
    });
    let userEmails: string[] = [];
   filteredTravels.map((value: any) => {
      userEmails.push(value.userEmail);
      value.joinedUsers.map((data: {userEmail: string}) => {
        userEmails.push(data.userEmail);
      })
      return userEmails;
    });
   const transferData = {
     travelId: travelId,
     userEmails: userEmails
   }
    console.log('Фильтрованный массив почт', userEmails);
    const dialogRef = this.dialog.open(DeleteDialogComponent,
      {
        data: transferData
      }
    );
    dialogRef.afterClosed().subscribe();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
