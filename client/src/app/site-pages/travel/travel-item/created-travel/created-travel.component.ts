import {Component, Input, OnInit} from '@angular/core';
import {Travel} from "../../../../shared/interfaces";
import {TravelService} from "../../../../shared/services/travel.service";
import {MaterialService} from "../../../../shared/classes/material.service";
import {MatDialog} from "@angular/material/dialog";
import {ReviewComponent} from "../../../map-travel/list-descriptions/review/review.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CabinetService} from "../../../cabinet/cabinet.service";
import {EditTravelModalComponent} from "./edit-travel-modal/edit-travel-modal.component";

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
  @Input() setTravelPublic!: any;
  @Input() openEditTravel!: any;
  @Input() getUserTravels!: any;
  @Input() userEmail!: string;
  @Input() openUserProfile!: any;

  form: FormGroup;
  rejectUserForm: FormGroup;

  constructor(
    public travelService: TravelService,
    public dialog: MatDialog,
    private cabinetService: CabinetService,
  ) {
    this.form = new FormGroup({
      rating: new FormControl('', Validators.required)
    });
    this.rejectUserForm = new FormGroup({
      comment: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.initMaterialize()
  }

  initMaterialize() {
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  }

  getNotAcceptedUsers() {
    return this.travel.joinedUsers.filter(el => el.status === 'Ожидает подтверждение от водителя' || el.status === 'Отказано')
  }

  getAcceptedUsers() {
    return this.travel.joinedUsers.filter(el => el.status !== 'Ожидает подтверждение от водителя' && el.status !== 'Отказано')
  }

  updateUserStatus(userEmail: string, status: string) {
    if (status === 'Ожидает оплаты' && this.travel.peoplesCount == this.getJoinedUsers(this.travel.joinedUsers).length) {
      return MaterialService.toast('Уже добавлено максимальное количество пользователей')
    }
    this.travelService.updateUserStatus(this.travel._id, userEmail, status).subscribe(
      () => this.getUserTravels(this.userEmail),
      error => console.log(error)
    )
  }

  getJoinedUsers(users: any) {
    return users.filter((el: any) => el.status !== 'Отказано' && el.status !== 'Ожидает подтверждение от водителя')
  }

  updateTravelStatus(status: string) {
    this.travelService.updateTravelStatus(this.travel._id, status).subscribe(
      () => this.getUserTravels(this.userEmail),
      error => console.log(error)
    )
  }

  checkAllUsersPayed() {
    const PayedUsersCount = this.travel.joinedUsers.filter((el: any) => el.status === 'Оплачено').length
    return PayedUsersCount == this.travel.peoplesCount ? true : false
  }

  openReviewDialog(receiverEmail: string) {
    const transferData = {
      travelId: this.travel._id,
      receiverEmail: receiverEmail
    }
    const dialogRef = this.dialog.open(ReviewComponent,
      {
        data: transferData
      }
    );
    dialogRef.afterClosed().subscribe();
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
    this.cabinetService.updateCabinetRating(receiverEmail, rating).subscribe();
  }

  rejectFormSubmit(userEmail: string) {
    if(!this.rejectUserForm.valid)
      return MaterialService.toast('Укажите причину отказа')
    this.travelService.updateUserRejectComment(this.travel._id, userEmail, this.rejectUserForm.controls.comment.value).subscribe(
      () => {
        this.updateUserStatus(userEmail, 'Отказано')
      },
      error => console.log(error)
    )
  }
}
