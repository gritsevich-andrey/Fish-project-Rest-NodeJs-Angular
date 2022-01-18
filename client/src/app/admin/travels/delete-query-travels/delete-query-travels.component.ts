import {Component, Input, OnInit} from '@angular/core';
import {TripComponent} from "../trip/trip.component";
import {Travels} from "../travels.component";
import {MatDialog} from "@angular/material/dialog";
import {TravelService} from "../../shared/services/travel.service";
import {MaterialService} from "../../../shared/classes/material.service";

@Component({
  selector: 'app-delete-query-travels',
  templateUrl: './delete-query-travels.component.html',
  styleUrls: ['./delete-query-travels.component.scss']
})
export class DeleteQueryTravelsComponent implements OnInit {
  @Input()
  travels!: any[]

  constructor(
    public dialog: MatDialog,
    private travelService: TravelService
  ) {
  }

  ngOnInit(): void {
  }

  openDialog(_id: string) {
    const travels = JSON.parse(JSON.stringify(this.travels));

    const filteredTravels = travels.filter((data: Travels) => {
      return data._id === _id;
    });
    const dialogRef = this.dialog.open(TripComponent,
      {
        data: filteredTravels
      }
    );
    dialogRef.afterClosed().subscribe();
  }

  deleteTravel(travelId: string) {
    this.travelService.deleteTravel(travelId).subscribe(
      () => {
        MaterialService.toast('Поездка удалена')
        let index = this.travels.findIndex(travel => travel._id === travelId)
        this.travels.splice(index, 1)
      },
      error => console.log(error)
    )
  }
}
