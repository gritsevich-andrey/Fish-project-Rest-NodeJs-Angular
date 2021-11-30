import {Component, Inject, OnInit} from '@angular/core';
import {WarningService} from "../../../../shared/services/warning.service";
import {UserService} from "../../../../shared/services/user.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  saveReview() {
    const email = this.userService.getUserDataFromLocal();
    const receiverEmail = this.data;
    const review = {senderEmail: email,
      reviewMessage: this.message
    }
this.userService.updateReview(receiverEmail, review).subscribe(data => {
  console.log('Ответ после сохранение отзыва в базе', data);
})
  }
}
