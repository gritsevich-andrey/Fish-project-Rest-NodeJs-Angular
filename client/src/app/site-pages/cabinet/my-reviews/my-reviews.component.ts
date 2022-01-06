import {Component, Input, OnInit} from '@angular/core';
import {Review} from "../../../shared/interfaces";
import {TravelService} from "../../../admin/shared/services/travel.service";
import {MatDialog} from "@angular/material/dialog";
import {CabinetService} from "../cabinet.service";
import {TripComponent} from "../../../admin/travels/trip/trip.component";

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.scss']
})
export class MyReviewsComponent implements OnInit {
  @Input()
  userEmail!: string;

  reviews: Review[] = []

  constructor(
    private travelService: TravelService,
    private dialog: MatDialog,
    private cabinetService: CabinetService
  ) {
  }

  ngOnInit(): void {
    this.getReviews(this.userEmail)
  }

  getReviews(userEmail: string) {
    this.cabinetService.getUserReviews(userEmail).subscribe(
      reviews => this.reviews = reviews,
      error => console.log(error)
    )
  }

  openTravel(travelId: string) {
    this.travelService.getTravel(travelId).subscribe(
      travel => {
        const dialogRef = this.dialog.open(TripComponent,
          {
            data: [travel]
          }
        );
        dialogRef.afterClosed().subscribe();
      },
      error => console.log(error)
    )
  }
}
