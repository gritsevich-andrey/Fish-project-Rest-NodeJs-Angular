import {Component, OnInit} from '@angular/core';
import {Travel} from "../../shared/interfaces";
import {CabinetService} from "../../site-pages/cabinet/cabinet.service";

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
    private cabinetService: CabinetService
  ) {
  }

  ngOnInit(): void {
    //много запросов
    this.initFormSelect()
    this.getAllTravels()
  }

  getAllTravels() {

    this.cabinetService.getReviewsCabinetData().subscribe(cabinets => {
        let travels: any = []
debugger
        cabinets.map((cabinet: any) => {
          let travelsIds = new Set()

          cabinet.reviews.map((review: any) => {
            travelsIds.add(review.travelId)
          })

          debugger
          travelsIds.forEach(id => {
              let userTravel: any = {}
              let travelRatings = cabinet.ratings.filter((rating: any) => rating.travelId === id)

              userTravel.id = id
              userTravel.reviews = cabinet.reviews.filter((review: any) => review.travelId === id)
              userTravel.averageRating = travelRatings.reduce((sum: number, rating: any) => {
                return sum + rating.sumValue
              }, 0) / travelRatings.length

              travels.push(userTravel)
            }
          )
        })

        //@ts-ignore
        this.travelsData = travels
        debugger
      },
      error => console.log(error))
  }

  initFormSelect() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }
}
