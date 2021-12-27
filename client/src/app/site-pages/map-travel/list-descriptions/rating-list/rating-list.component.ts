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
  ratingValue = {travelId: '', sumValue: 0};
  sumValue = 0;
  travelID = '';
  constructor(private cabinetService: CabinetService) {
  }

  ngOnInit(): void {
    this.cabinetService.getCabinetRating(this.travelId, this.organizerEmail).subscribe(data => {
      //@ts-ignore
      this.ratingValue = data;
      console.log('Данные', data);
      data.forEach((value:any) => {
        // @ts-ignore
        this.travelID  = value.travelId;
        // @ts-ignore
        if(this.sumValue === 0){
          // @ts-ignore
          this.sumValue = value.ratingValue;
        }
        else {
          // @ts-ignore
          this.sumValue = (this.sumValue+ value.ratingValue)/2;
        }
      })
this.ratingValue.travelId = this.travelID;
this.ratingValue.sumValue = this.sumValue;
      console.log('Сумма', this.ratingValue);
    });

  }

}
