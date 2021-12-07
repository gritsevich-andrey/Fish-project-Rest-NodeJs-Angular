import {Component, Input, OnInit} from '@angular/core';
import {Travel} from "../../../shared/interfaces";

@Component({
  selector: 'app-travel-item',
  templateUrl: './travel-item.component.html',
  styleUrls: ['./travel-item.component.scss']
})
export class TravelItemComponent implements OnInit {
  //@ts-ignore
  @Input() travel: Travel;
  //@ts-ignore
  @Input() userEmail: string;
  //@ts-ignore
  @Input() setTravelPublic;
  //@ts-ignore
  @Input() openEditTravel;
  //@ts-ignore
  @Input() getUserTravels;

  constructor() {
  }

  ngOnInit(): void {
  }

}
