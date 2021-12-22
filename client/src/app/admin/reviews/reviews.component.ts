import {Component, OnInit} from '@angular/core';
import {CabinetService} from "../../site-pages/cabinet/cabinet.service";
import {TravelService} from "../shared/services/travel.service";
import {TripComponent} from "../travels/trip/trip.component";
import {MatDialog} from "@angular/material/dialog";
import {ReviewsListComponent} from "./reviews-list/reviews-list.component";

declare var M: { FormSelect: { init: (arg0: NodeListOf<Element>) => any; }; }

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  page: number = 1;
  travelsOnPage!: number;
  defaultTravelsOnPage: number = 10;
  travelsData: any = []

  constructor(
    private cabinetService: CabinetService,
    private travelService: TravelService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initFormSelect()
    this.getAllTravels()
  }

  getAllTravels() {
    this.cabinetService.getReviewsCabinetData().subscribe(cabinets => {
        let travels: any = []

        cabinets.map((cabinet: any) => {
          cabinet.reviews.map((review: any) => {
            const isNewTravel = travels.every((travel: any) => travel.id !== review.travelId)

            if (isNewTravel) {
              travels.push({
                userEmail: cabinet.userEmail,
                id: review.travelId,
                reviews: [{
                  receiverFIO: cabinet.fio,
                  senderFIO: review.userFIO,
                  reviewText: review.reviewText,
                  date: review.date,
                }]
              })
            } else {
              const travelIndex = travels.findIndex((travel: any) => travel.id === review.travelId)
              travels[travelIndex].reviews.push({
                receiverFIO: cabinet.fio,
                senderFIO: review.userFIO,
                reviewText: review.reviewText,
                date: review.date
              })
            }
          })
        })

        this.travelsData = travels
      },
      error => console.log(error))
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

  openReviews(travel: any) {
    const dialogRef = this.dialog.open(ReviewsListComponent,
      {
        data: travel
      }
    );
    dialogRef.afterClosed().subscribe();
  }

  initFormSelect() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }
}
