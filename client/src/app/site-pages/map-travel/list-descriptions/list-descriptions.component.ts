import {Component, Input, OnInit} from '@angular/core';
import {Travel} from "../../../shared/interfaces";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog/dialog.component";
import {ChatDialogComponent} from "./chat-dialog/chat-dialog.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ReviewComponent} from "./review/review.component";
import {CabinetService} from "../../cabinet/cabinet.service";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-list-descriptions',
  templateUrl: './list-descriptions.component.html',
  styleUrls: ['./list-descriptions.component.scss']
})
export class ListDescriptionsComponent implements OnInit {
  //@ts-ignore
  @Input() travels: Travel;
  imageNull = 'uploads/avatar.jpg';
  //@ts-ignore
  form: FormGroup;

  constructor(public dialog: MatDialog,
              private cabinetService: CabinetService,
              private userService: UserService,
  ) {
    this.form = new FormGroup({
      rating: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent,
      //   {
      //   width: '250px'
      // }
    );
    dialogRef.afterClosed().subscribe();
  }

  openChatDialog(receiverEmail: string) {
    const dialogRef = this.dialog.open(ChatDialogComponent,
      {
        data: receiverEmail
      }
    );
    dialogRef.afterClosed().subscribe();
  }

  openReviewDialog(receiverEmail: string) {
    const transferData = {
      travelId: this.travels._id,
      receiverEmail: receiverEmail
    }
    const dialogRef = this.dialog.open(ReviewComponent,
      {
        data: transferData
      }
    );
    dialogRef.afterClosed().subscribe();
  }

  saveRating(receiverEmail: string, travelId: string, travelTitle: string) {
    const rating = {
      travelId,
      travelTitle,
      sumValue: this.form.value.rating
    };
    this.cabinetService.updateCabinetRating(receiverEmail, rating).subscribe();
  }
}
