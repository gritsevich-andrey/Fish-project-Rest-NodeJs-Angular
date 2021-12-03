import {Component, Input, OnInit} from '@angular/core';
import {Travel} from "../../../../shared/interfaces";

@Component({
  selector: 'app-joined-travel',
  templateUrl: './joined-travel.component.html',
  styleUrls: ['./joined-travel.component.scss']
})
export class JoinedTravelComponent implements OnInit {
  //@ts-ignore
  @Input() travel: Travel;
  //@ts-ignore
  @Input() userEmail: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  getJoinedUsers(users: any) {
    return users.filter((el: any) => el.status !== 'Отказано' && el.status !== 'Ожидает подтверждение от водителя')
  }

  getPayedUsers(users: any) {
    return users.filter((el: any) => el.status === 'Оплачено' )
  }

  getUserStatus(email: string, travel: any) {
    const {status} = travel.joinedUsers.find((el: any) => el.userEmail === email)
    return status
  }
}
