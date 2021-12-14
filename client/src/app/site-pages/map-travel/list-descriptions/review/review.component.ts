import {Component, Inject, OnInit} from '@angular/core';
import {WarningService} from "../../../../shared/services/warning.service";
import {UserService} from "../../../../shared/services/user.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CabinetService} from "../../../cabinet/cabinet.service";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
//@ts-ignore
  message: string;

  constructor(
    private warningService: WarningService,
    private userService: UserService,
    private cabinetService: CabinetService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
  }

  saveReview() {
    const email = this.userService.getUserDataFromLocal();
    const receiverEmail = this.data.receiverEmail;
    const travelId = this.data.travelId;
    const review = {
      userEmail: email,
      reviewText: this.message,
      travelId: travelId
    };
    this.cabinetService.updateCabinetReview(receiverEmail, review).subscribe(data => {
      console.log('Ответ после сохранение отзыва в базе', data);
    })
  }
}
