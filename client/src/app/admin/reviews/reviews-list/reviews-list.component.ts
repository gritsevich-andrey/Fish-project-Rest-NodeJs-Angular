import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TravelService} from "../../../shared/services/travel.service";

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.scss']
})
export class ReviewsListComponent implements OnInit {
  reviews: any = []

  constructor(
    private route: ActivatedRoute,
    private travelService: TravelService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const travelId = params['id']
      this.getReviews(travelId)
    });
  }

  getReviews(travelId: string) {
  }
}
