import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CabinetService} from "../../../site-pages/cabinet/cabinet.service";
import {MaterialService} from "../../../shared/classes/material.service";

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.scss']
})
export class ReviewsListComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cabinetService: CabinetService
  ) {
  }

  ngOnInit() {
  }

  updateReviewShown(reviewId: string, status: boolean) {
    this.cabinetService.updateReviewShown(reviewId, status).subscribe(
      () => MaterialService.toast('Статус обновлен'),
      error => console.log(error)
    )
  }
}
