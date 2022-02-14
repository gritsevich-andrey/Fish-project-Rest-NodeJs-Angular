import {Component, Inject, OnInit} from '@angular/core';
import {WarningService} from "../../../../shared/services/warning.service";
import {UserService} from "../../../../shared/services/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CabinetService} from "../../../cabinet/cabinet.service";
import {MaterialService} from "../../../../shared/classes/material.service";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
//@ts-ignore
  message: string;

  constructor(
    private warningService: WarningService,
    private userService: UserService,
    private cabinetService: CabinetService,
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  saveReview() {
    if(!this.message)
      return MaterialService.toast('Введите текст отзыва')

    const email = this.userService.getUserDataFromLocal();
    const receiverEmail = this.data.receiverEmail;
    const travelId = this.data.travelId;
    const userFIO = this.data.userFIO
    const travelName = this.data.name

    const review = {
      userEmail: email,
      reviewText: this.message,
      userFIO,
      travelId,
      travelName
    };
    this.cabinetService.updateCabinetReview(receiverEmail, review).subscribe(
      () => {
        MaterialService.toast('Отзыв оставлен')
        this.dialog.close({success: true})
      },
      error => {
        console.log(error)
        if (error.status === 404) {
          MaterialService.toast(error.error.message)
        } else {
          MaterialService.toast('Ошибка сохранения отзыва')
        }
      }
    )
  }
}
