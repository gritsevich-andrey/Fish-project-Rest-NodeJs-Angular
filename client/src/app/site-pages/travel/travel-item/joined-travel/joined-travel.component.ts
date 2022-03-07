import {Component, Input, OnInit} from '@angular/core';
import {JoinedUser, Travel} from "../../../../shared/interfaces";
import {TravelService} from "../../../../shared/services/travel.service";
import {ReviewComponent} from "../../../map-travel/list-descriptions/review/review.component";
import {MatDialog} from "@angular/material/dialog";
import {MaterialService} from "../../../../shared/classes/material.service";
import {FormControl, FormGroup} from "@angular/forms";
import {CabinetService} from "../../../cabinet/cabinet.service";
import {UserProfileComponent} from "../../user-profile/user-profile.component";
import {forkJoin} from "rxjs";
import {ComplaintComponent} from "../../complaint/complaint.component";
import {RejectsListComponent} from "../created-travel/rejects-list/rejects-list.component";
import {RejectComponent} from "../../reject/reject.component";

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
  isSetReview = false
  travelStatus!: string;
  userStatus!: string;
  acceptedUsers: any = []

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
    const user = this.getJoinedUserFromTravel(this.userEmail)
    this.form.controls.rating.setValue(user?.travelRating || 0)
    this.isSetRating = user?.isTravelRatingSet || false
    this.isSetReview = user?.isTravelReviewSet || false
    this.travelStatus = this.getTravelStatus()
    this.userStatus = this.getUserStatus()
    this.acceptedUsers = this.getAcceptedUsers()
  }

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

  getUsersWithoutUser(users: JoinedUser[], deleteEmail: string) {
    const newUsers: JoinedUser[] = []
    users.map(user => {
      if (user.userEmail !== deleteEmail)
        newUsers.push(user)
    })
    return newUsers
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
      if (this.travel.status === 'ended') {
        //Нужно добавить условие
        return 'Ожидает отзывы и рейтинг'
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
    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res?.success) {
          this.isSetReview = true
          this.travelService.updateUserTravelReview(this.travel._id, this.userEmail).subscribe()
        }
      }
    );
  }

  getUserFIO() {
    //@ts-ignore
    const {fio} = this.travel.joinedUsers.find(user => user.userEmail = this.userEmail)
    return fio
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
      travelName: this.travel.name,
      sumValue: stars
    };
    if (!stars) {
      return MaterialService.toast('Укажите рейтинг')
    }
    forkJoin([this.cabinetService.updateCabinetRating(receiverEmail, rating),
      this.travelService.updateUserTravelRating(this.travel._id, this.userEmail, stars)])
      .subscribe(
        () => {
          this.isSetRating = true
          MaterialService.toast('Рейтинг сохранен')
        },
        error => {
          MaterialService.toast('Ошибка сохранения')
          console.log(error)
        }
      )
  }

  openReject() {
    const dialogRef = this.dialog.open(RejectComponent)
    dialogRef.afterClosed().subscribe((res: { reason?: string }) => {
      if (res?.reason) {
        this.leaveFromTravel(res.reason)
      }
    })
  }

  leaveFromTravel(reject: string) {
    const author: string = this.getUserFIO() || this.userEmail.split('@')[0]

    this.travelService.leaveFromTravel(this.userEmail, this.travel._id, reject, author).subscribe(
      () => {
        MaterialService.toast('Вы отказались от поездки')
        this.getUserTravels(this.userEmail)
      },
      error => console.log(error)
    )
  }

  openComplaint(email: string) {
    const dialogRef = this.dialog.open(ComplaintComponent, {data: {email, senderEmail: this.userEmail}});
    dialogRef.afterClosed().subscribe();
  }
}
