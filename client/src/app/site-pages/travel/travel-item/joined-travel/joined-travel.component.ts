import {Component, Input, OnInit} from '@angular/core';
import {JoinedUser, Travel} from "../../../../shared/interfaces";
import {TravelService} from "../../../../shared/services/travel.service";
import {ReviewComponent} from "../../../map-travel/list-descriptions/review/review.component";
import {MatDialog} from "@angular/material/dialog";
import {MaterialService} from "../../../../shared/classes/material.service";
import {Form, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {CabinetService} from "../../../cabinet/cabinet.service";
import {UserProfileComponent} from "../../user-profile/user-profile.component";
import {mimeType} from "../../../cabinet/mime-type.validator";

@Component({
  selector: 'app-joined-travel',
  templateUrl: './joined-travel.component.html',
  styleUrls: ['./joined-travel.component.scss']
})
export class JoinedTravelComponent implements OnInit {
  @Input() travel!: Travel;
  @Input() userEmail!: string;
  @Input() getUserTravels!: any;
  form!: FormGroup;
  isSetRating = false

  constructor(
    public travelService: TravelService,
    public dialog: MatDialog,
    private cabinetService: CabinetService,
  ) {
    this.form = new FormGroup({
      rating: new FormControl(0),
    });
  }

  ngOnInit(): void {
    //this.setUsersRating()
    const user = this.getJoinedUserFromTravel(this.userEmail)
    this.form.controls.rating.setValue(user?.travelRating || 0)
    this.isSetRating = user?.isTravelRatingSet || false
  }

  // setUsersRating() {
  //   //@ts-ignore
  //   let ratings: Rating[] = JSON.parse(localStorage.getItem('travelsRating'))
  //
  //   if (ratings) {
  //     ratings.map(rating => {
  //       if (this.travel.userEmail === rating.email && rating.travelId === this.travel._id) {
  //         this.form.controls.rating.setValue(rating.sumValue)
  //         this.isRatingSet = true
  //       }
  //     })
  //   }
  // }
  getJoinedUserFromTravel(email: string) {
    return this.travel.joinedUsers.find(user => user.userEmail === email)
  }

  getAcceptedUsers() {
    return this.travel.joinedUsers.filter(user => user.status !== 'Ожидает подтверждение от водителя' && user.status !== 'Отказано')
  }

  getJoinedUsers() {
    return this.travel.joinedUsers.filter((user: any) => user.status !== 'Отказано' && user.status !== 'Ожидает подтверждение от водителя')
  }

  getUserStatus() {
    // @ts-ignore
    const {status} = this.travel.joinedUsers.find((user: any) => user.userEmail === this.userEmail)
    return status
  }

  fakePay() {
    this.travelService.updateUserStatus(this.travel._id, this.userEmail, 'Оплачено').subscribe(
      () => this.getUserTravels(this.userEmail),
      error => console.log(error)
    )
  }

  checkAllUsersPayed() {
    const PayedUsersCount = this.travel.joinedUsers.filter((user: any) => user.status === 'Оплачено').length
    return PayedUsersCount == this.travel.peoplesCount
  }

  getTravelStatus() {
    const userStatus = this.getUserStatus()

    if (userStatus === 'Ожидает подтверждение от водителя') {
      return 'Ожидает подтверждение от водителя'
    } else if (userStatus === 'Ожидает оплаты') {
      return 'Ожидает оплаты'
    } else if (userStatus === 'Оплачено') {
      if (this.checkAllUsersPayed()) {
        if (this.travel.status === 'ended') {
          //Нужно добавить условие
          return 'Ожидает отзывы и рейтинг'
        } else {
          return 'Готов к поездке'
        }
      } else {
        return 'Комплектуется'
      }
    } else {
      return userStatus
    }
  }

  getRejectReason() {
    //@ts-ignore
    const {comment} = this.travel.joinedUsers.find((user: any) => user.userEmail === this.userEmail)
    return comment
  }

  openReviewDialog(receiverEmail: string) {
    const transferData = {
      travelId: this.travel._id,
      receiverEmail: receiverEmail,
      userFIO: this.getUserFIO()
    }
    const dialogRef = this.dialog.open(ReviewComponent,
      {
        data: transferData
      }
    );
    dialogRef.afterClosed().subscribe();
  }

  getUserFIO() {
    let userFIO = ''

    this.travel.joinedUsers.map(user => {
      if (user.userEmail = this.userEmail) {
        userFIO = user.fio
      }
    })

    return userFIO
  }

  openUserProfile(userEmail: string) {
    const dialogRef = this.dialog.open(UserProfileComponent,
      {
        data: {
          email: userEmail
        }
      }
    );
    dialogRef.afterClosed().subscribe();
  }

  saveRating(receiverEmail: string) {
    const stars = this.form.controls.rating.value
    const rating = {
      travelId: this.travel._id,
      travelTitle: this.travel.title,
      sumValue: stars
    };
    if (!stars) {
      return MaterialService.toast('Укажите рейтинг')
    }
    this.cabinetService.updateCabinetRating(receiverEmail, rating).subscribe(
      () => {
        //@ts-ignore
        // let ratings = JSON.parse(localStorage.getItem('travelsRatings')) || []
        // ratings.push({
        //   email: receiverEmail,
        //   isRatingSet: true,
        //   ...rating
        // })
        // localStorage.setItem('travelsRating', JSON.stringify(ratings))
        this.travelService.updateUserTravelRating(this.travel._id, this.userEmail, stars).subscribe(
          () => MaterialService.toast('Рейтинг сохранен'),
          error => {
            MaterialService.toast('Ошибка сохранения')
            console.log(error)
          }
        )
      },
      error => console.log(error)
    );
  }

  leaveFromTravel() {
    this.travelService.leaveFromTravel(this.userEmail, this.travel._id).subscribe(
      () => {
        MaterialService.toast('Вы отказались от поездки')
        this.getUserTravels(this.userEmail)
      },
      error => console.log(error)
    )
  }
}
