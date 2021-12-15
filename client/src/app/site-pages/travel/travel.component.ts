import {Component, OnInit} from '@angular/core';
import {UserService} from "../../shared/services/user.service";
import {TravelService} from "../../shared/services/travel.service";
import {CabinetService} from "../cabinet/cabinet.service";
import {Sort} from "@angular/material/sort";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CreateTravelModalComponent} from "./create-travel-modal/create-travel-modal.component";

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements OnInit {
  userEmail!: string
  userTravels: any[] = []
  openedUserPage!: any;

  constructor(
    private userService: UserService,
    private travelService: TravelService,
    private cabinetService: CabinetService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {  }

  ngOnInit(): void {
    let userEmail = this.route.snapshot.paramMap.get('userEmail');
    let travelId = this.route.snapshot.paramMap.get('travelId');

    this.userEmail = this.userService.getUserDataFromLocal()
    this.getUserTravels(this.userEmail)
  }

  getUserTravels(userEmail: string) {
    this.travelService.getUserTravels(userEmail).subscribe(
      data => this.userTravels = data,
      error => console.log(error)
    )
  }

  sortData(sort: Sort) {
    const data = this.userTravels.slice();
    if (!sort.active || sort.direction === '') {
      this.userTravels = data;
      return;
    }

    //@ts-ignore
    this.userTravels = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': {
          //@ts-ignore
          return this.compare(a.date, b.date, isAsc);
        }
        case 'title': {
          //@ts-ignore
          return this.compare(a.title, b.title, isAsc);
        }
        default:
          return 0;
      }
    });
  }

  compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openUserProfile(userEmail: string) {
    this.cabinetService.getCabinetData(userEmail).subscribe(data => {
      this.openedUserPage = data
    })
  }

  openCreateTravel() {
    const dialogRef = this.dialog.open(CreateTravelModalComponent,
      {
        data: {
          userEmail: this.userEmail
        }
      }
    );
    dialogRef.afterClosed().subscribe();
  }
}
