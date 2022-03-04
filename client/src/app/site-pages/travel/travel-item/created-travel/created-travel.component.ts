import {Component, Input, OnInit} from '@angular/core';
import {JoinedUser, Travel} from "../../../../shared/interfaces";
import {TravelService} from "../../../../shared/services/travel.service";
import {MaterialService} from "../../../../shared/classes/material.service";
import {MatDialog} from "@angular/material/dialog";
import {ReviewComponent} from "../../../map-travel/list-descriptions/review/review.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CabinetService} from "../../../cabinet/cabinet.service";
import {EditTravelModalComponent} from "./edit-travel-modal/edit-travel-modal.component";
import {UserProfileComponent} from "../../user-profile/user-profile.component";
import {ChatDialogComponent} from "../../../map-travel/list-descriptions/chat-dialog/chat-dialog.component";
import {Router} from "@angular/router";
import {forkJoin} from "rxjs";
import {error} from "password-validator/typings/constants";
import {ComplaintComponent} from "../../complaint/complaint.component";
import {RejectComponent} from "../../reject/reject.component";
import {AcceptJoinComponent} from "../../accept-join/accept-join.component";

declare var M: {
  Modal: { init: (arg0: NodeListOf<Element>) => any; }
}

@Component({
  selector: 'app-created-travel',
  templateUrl: './created-travel.component.html',
  styleUrls: ['./created-travel.component.scss']
})
export class CreatedTravelComponent implements OnInit {
  @Input() travel!: Travel;
  @Input() getUserTravels!: any;
  @Input() userEmail!: string;
  @Input() deleted = false;
  form: FormGroup;
  joinedUsers = [];
  acceptedUsers: any = [];
  notAcceptedUsers: any = [];

  constructor(
    public travelService: TravelService,
    public dialog: MatDialog,
    private cabinetService: CabinetService,
    private router: Router
  ) {
    this.form = new FormGroup({
      rating: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.initMaterialize()
    this.joinedUsers = this.getJoinedUsers(this.travel.joinedUsers)
    this.acceptedUsers = this.getAcceptedUsers()
    this.notAcceptedUsers = this.getNotAcceptedUsers()

    if (this.checkAllUsersPayed() && !this.travel.status) {
      this.updateTravelStatus('started')
    }
  }

  initMaterialize() {
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  }

  getNotAcceptedUsers() {
    return this.travel.joinedUsers.filter(user => user.status === 'Ожидает подтверждение от водителя' || user.status === 'Отказано')
  }

  getAcceptedUsers() {
    return this.travel.joinedUsers.filter(user => user.status !== 'Ожидает подтверждение от водителя' && user.status !== 'Отказано')
  }

  acceptUser(userEmail: string, status: string, user: JoinedUser) {
    if (this.travel.peoplesCount == this.joinedUsers.length) {
      MaterialService.toast('Уже добавлено максимальное количество пользователей')
    } else {
      this.travelService.updateUserStatus(this.travel._id, userEmail, status).subscribe(
        () => {
          user.status = 'Ожидает оплаты'
          this.joinedUsers = this.getJoinedUsers(this.travel.joinedUsers)
        },
        error => console.log(error)
      )
    }
  }

  getJoinedUsers(users: any) {
    return users.filter((user: any) => user.status !== 'Отказано' && user.status !== 'Ожидает подтверждение от водителя')
  }

  updateTravelStatus(status: string) {
    this.travelService.updateTravelStatus(this.travel._id, status).subscribe(
      () => this.getUserTravels(this.userEmail),
      error => console.log(error)
    )
  }

  checkAllUsersPayed() {
    const PayedUsersCount = this.travel.joinedUsers.filter((user: any) => user.status === 'Оплачено').length
    return PayedUsersCount == this.travel.peoplesCount
  }

  openReviewDialog(receiverEmail: string, user: JoinedUser) {
    const transferData = {
      travelId: this.travel._id,
      receiverEmail: receiverEmail,
      userFIO: this.travel.userFIO
    }
    const dialogRef = this.dialog.open(ReviewComponent,
      {
        data: transferData
      }
    );
    dialogRef.afterClosed().subscribe(
      ({success}) => {
        if (success) {
          user.isReviewSet = true
          this.travelService.updateUserReview(this.travel._id, user.userEmail).subscribe()
        }
      }
    );
  }

  openEditTravelModal(travel: any) {
    const dialogRef = this.dialog.open(EditTravelModalComponent,
      {
        data: {
          travel,
          userEmail: this.userEmail
        }
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.updated) {
        this.getUserTravels(this.userEmail)
      }
    });
  }

  saveRating(receiverEmail: string, ratingCount: number, user: JoinedUser) {
    const rating = {
      travelId: this.travel._id,
      travelName: this.travel.name,
      sumValue: ratingCount
    };
    if (!ratingCount) {
      return MaterialService.toast('Укажите рейтинг')
    }

    forkJoin([
      this.cabinetService.updateCabinetRating(receiverEmail, rating),
      this.travelService.updateUserRating(this.travel._id, receiverEmail, ratingCount)
    ]).subscribe(
      () => {
        user.isRatingSet = true
        MaterialService.toast('Рейтинг сохранен')
      },
      error => {
        MaterialService.toast('Ошибка сохранения')
        console.log(error)
      }
    )
  }

  // rejectFormSubmit(userEmail: string, user: JoinedUser) {
  //   if (!this.rejectUserForm.valid) {
  //     MaterialService.toast('Укажите причину отказа')
  //   } else {
  //     forkJoin([
  //       this.travelService.updateUserRejectComment(this.travel._id, userEmail, this.rejectUserForm.controls.comment.value),
  //       this.travelService.updateUserStatus(this.travel._id, userEmail, 'Отказано')
  //     ]).subscribe(
  //       () => user.status = 'Отказано',
  //       error => console.log(error)
  //     )
  //   }
  // }


  openReject(userEmail: string, user: JoinedUser) {
    const dialogRef = this.dialog.open(RejectComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        forkJoin([
          this.travelService.updateUserRejectComment(this.travel._id, userEmail, data.reason),
          this.travelService.updateUserStatus(this.travel._id, userEmail, 'Отказано')
        ]).subscribe(
          () => {
            MaterialService.toast('Пользователю отказано в присоединении к поездке')
            user.status = 'Отказано'
          },
          error => console.log(error)
        )
      }
    });
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

  openChat(email: string) {
    const dialogRef = this.dialog.open(ChatDialogComponent,
      {
        data: email
      }
    );
    dialogRef.afterClosed().subscribe(({isMessageSend}) => {
      if (isMessageSend) {
        this.router.navigate(['/chat'])
      }
    });
  }

  setTravelPublic(travelId: string) {
    this.travel.isPublic = !this.travel.isPublic
    this.travelService.updateTravel(this.travel, travelId).subscribe()
  }

  deleteTravel(travelId: string) {
    const dialogRef = this.dialog.open(AcceptJoinComponent,
      {
        data: {
          text: 'удалить эту поездку'
        }
      }
    );
    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res?.accept) {
          this.travelService.updateTravel({queryDelete: true}, travelId).subscribe(
            () => {
              MaterialService.toast('Поездка удалена')
              this.getUserTravels(this.userEmail)
            },
            error => console.log(error)
          )
        }
      }
    )
  }

  openComplaint(email
                  :
                  string
  ) {
    const dialogRef = this.dialog.open(ComplaintComponent, {data: {email, senderEmail: this.userEmail}});
    dialogRef.afterClosed().subscribe();
  }
}
