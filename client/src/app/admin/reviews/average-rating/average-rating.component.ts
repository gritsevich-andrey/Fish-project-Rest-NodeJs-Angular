import {Component, Input, OnInit} from '@angular/core';
import {CabinetService} from "../../../site-pages/cabinet/cabinet.service";

@Component({
  selector: 'app-average-rating',
  templateUrl: './average-rating.component.html',
  styleUrls: ['./average-rating.component.scss']
})
export class AverageRatingComponent implements OnInit {
  averageRating = 0;

  @Input()
  travelId!: string;

  @Input()
  userEmail!: string;

  constructor(
    private cabinetService: CabinetService
  ) {
  }

  ngOnInit(): void {
    this.cabinetService.getCabinetRating(this.travelId, this.userEmail).subscribe((data) => {
      this.averageRating = data[0]?.ratingValue;
    });
  }

}
