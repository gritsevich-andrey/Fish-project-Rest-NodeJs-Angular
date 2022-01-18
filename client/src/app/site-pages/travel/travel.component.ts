import {Component, OnInit} from '@angular/core';
import {UserService} from "../../shared/services/user.service";
import {TravelService} from "../../shared/services/travel.service";
import {CabinetService} from "../cabinet/cabinet.service";
import {Sort} from "@angular/material/sort";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CreateTravelModalComponent} from "./create-travel-modal/create-travel-modal.component";
import * as CryptoJS from "crypto-js";
import {AuthService} from "../../shared/services/auth.service";
import {MaterialService} from "../../shared/classes/material.service";
import {Travel} from "../../shared/interfaces";

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements OnInit {
  userEmail!: string
  userTravels: any[] = []

  constructor(
    private userService: UserService,
    private travelService: TravelService,
    private cabinetService: CabinetService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    let urlParams = this.route.snapshot.paramMap.get('cryptData');
    this.userEmail = this.userService.getUserDataFromLocal()

    if (urlParams) {
      const pass = this.authService.getToken();
      const data = CryptoJS.AES.decrypt(urlParams, pass).toString(CryptoJS.enc.Utf8);
      let [userEmail, travelId] = data.split('/')
      this.joinTravel(userEmail, travelId)
    } else
      this.getUserTravels(this.userEmail)
  }

  joinTravel(userEmail: string, travelId: string) {
    this.travelService.joinTravel(userEmail, travelId).subscribe(
      () => {
        MaterialService.toast('Вы присоединились к поездке')
        this.getUserTravels(this.userEmail)
      },
      ({error}) => {
        if (error.message)
          MaterialService.toast(error.message)
        else
          MaterialService.toast('Ошибка присоединения')

        this.getUserTravels(this.userEmail)
      }
    )
  }

  getUserTravels(userEmail: string) {
    this.travelService.getUserTravels(userEmail).subscribe(
      (travels: Travel[]) => this.userTravels = travels.reverse().filter(travel => !travel.queryDelete),
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
