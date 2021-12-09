import {Component, Input, OnInit} from '@angular/core';
import {CabinetService} from "../../../cabinet/cabinet.service";

@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.scss']
})
export class RatingListComponent implements OnInit {
//@ts-ignore;
  @Input() travelId: string;
  //@ts-ignore;
  @Input() organizerEmail: string;
  constructor(private cabinetService: CabinetService) { }

  ngOnInit(): void {
    console.log('Идентификатор поездки', this.travelId, this.organizerEmail);
    this.cabinetService.getCabinetRating(this.travelId, this.organizerEmail).subscribe();
  }

}
