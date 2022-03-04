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
import {AcceptJoinComponent} from "./accept-join/accept-join.component";

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements OnInit {
  userEmail!: string
  activeTravels: Travel[] = []
  endedTravels: Travel[] = []
  deletedTravels: Travel[] = []

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
      const dialogRef = this.dialog.open(AcceptJoinComponent,
        {
          data: {
            text: 'присоединиться к этой поездке'
          }
        }
      );
      dialogRef.afterClosed().subscribe(
        (res) => {
          if (res?.accept) {
            const pass = this.authService.getToken();
            // @ts-ignore
            const data = CryptoJS.AES.decrypt(urlParams, pass).toString(CryptoJS.enc.Utf8);
            let [userEmail, travelId] = data.split('/')
            this.joinTravel(userEmail, travelId)
          } else {
            this.getUserTravels(this.userEmail)
          }
        }
      );
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
      (travels: Travel[]) => {
        this.activeTravels = travels.reverse().filter(travel => !travel.queryDelete && travel.status !== 'ended')
        this.endedTravels = travels.reverse().filter(travel => !travel.queryDelete && travel.status === 'ended')
        this.deletedTravels = travels.reverse().filter(travel => travel.queryDelete)
      },
      error => console.log(error)
    )
  }

  sortData(sort: Sort, array: Travel[]) {
    const data = array.slice();
    if (!sort.active || sort.direction === '') {
      this.activeTravels = data;
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

  compare(a
            :
            string | number, b
            :
            string | number, isAsc
            :
            boolean
  ) {
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
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.created) {
        this.getUserTravels(this.userEmail)
      }
    });

  }
}
