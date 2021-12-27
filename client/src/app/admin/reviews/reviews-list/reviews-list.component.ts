import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {CabinetService} from "../../../site-pages/cabinet/cabinet.service";
import {MaterialService} from "../../../shared/classes/material.service";
import {RejectReasonComponent} from "../reject-reason/reject-reason.component";

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.scss']
})
export class ReviewsListComponent implements OnInit {
  reviews: any = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cabinetService: CabinetService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.reviews = this.data.reviews
  }

  updateReviewShown(reviewId: string, status: boolean, index: number) {
    this.cabinetService.updateReviewShown(reviewId, status).subscribe(
      () => {
        this.reviews[index].isShown = true
        MaterialService.toast('Статус обновлен')
      },
      error => console.log(error)
    )
  }

  openRejectReason(reviewId: string, index: number) {
    const dialogRef = this.dialog.open(RejectReasonComponent,
      {
        data: {
          reviewId
        }
      }
    );
    dialogRef.afterClosed().subscribe((response) => {
      if(response) {
        this.reviews[index].isShown = false
      }
    });
  }
}
