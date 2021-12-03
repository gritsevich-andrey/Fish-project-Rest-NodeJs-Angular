import {Component, Input, OnInit} from '@angular/core';
import {Travel} from "../../../../shared/interfaces";
import {TravelService} from "../../../../shared/services/travel.service";

@Component({
  selector: 'app-created-travel',
  templateUrl: './created-travel.component.html',
  styleUrls: ['./created-travel.component.scss']
})
export class CreatedTravelComponent implements OnInit {
  //@ts-ignore
  @Input() travel: Travel;
  //@ts-ignore
  @Input() setTravelPublic;
  //@ts-ignore
  @Input() openEditTravel;

  acceptedUsers: any = [];
  notAcceptedUsers: any = [];

  constructor(
    public travelService: TravelService
  ) {
  }

  ngOnInit(): void {
    this.notAcceptedUsers = this.travel.joinedUsers.filter(el => el.status === 'Ожидает подтверждение от водителя' || el.status === 'Отказано')
    this.acceptedUsers = this.travel.joinedUsers.filter(el => el.status !== 'Ожидает подтверждение от водителя' && el.status !== 'Отказано')
  }

  updateJoinedUserStatus(userEmail: string, status: string) {
    this.travelService.updateJoinedUserStatus(this.travel._id, userEmail, status).subscribe()
  }
}
