import {Component, OnInit} from '@angular/core';
import {Travel} from "../../shared/interfaces";
import {TravelService} from "../../shared/services/travel.service";

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
  travelsData: Travel[] = []

  constructor(
    private travelService: TravelService
  ) {
  }

  ngOnInit(): void {
    //много запросов
    this.initFormSelect()
    this.getAllTravels()
  }

  getAllTravels() {
    this.travelService.getAllTravels().subscribe(travels => {
        this.travelsData = travels
      },
      error => console.log(error))
  }

  initFormSelect() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }
}
