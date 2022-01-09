import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA,  MatDialogRef} from "@angular/material/dialog";
import {MaterialService} from "../../../shared/classes/material.service";
import {CabinetService} from "../../../site-pages/cabinet/cabinet.service";
import {ReviewsListComponent} from "../reviews-list/reviews-list.component";

@Component({
  selector: 'app-reject-reason',
  templateUrl: './reject-reason.component.html',
  styleUrls: ['./reject-reason.component.scss']
})
export class RejectReasonComponent implements OnInit {
  rejectReason!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cabinetService: CabinetService,
    public dialog: MatDialogRef<ReviewsListComponent>
  ) {
  }

  ngOnInit(): void {
  }

  deleteReview() {
    if (!this.rejectReason) {
      MaterialService.toast('Укажите причину удаления')
    } else {
      this.cabinetService.updateReviewShown(this.data.reviewId, false, this.rejectReason).subscribe(
        () => {
          this.dialog.close({data: true});
          MaterialService.toast('Статус обновлен')
        },
        error => console.log(error)
      )
    }
  }
}
