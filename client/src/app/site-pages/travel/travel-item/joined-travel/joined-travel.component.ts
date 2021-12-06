import {Component, Input, OnInit} from '@angular/core';
import {Travel} from "../../../../shared/interfaces";
import {TravelService} from "../../../../shared/services/travel.service";

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
  //@ts-ignore
  @Input() getUserTravels;
  acceptedUsers: any = [];

  constructor(
    public travelService: TravelService
  ) {
  }

  ngOnInit(): void {
    this.acceptedUsers = this.travel.joinedUsers.filter(el => el.status !== 'Ожидает подтверждение от водителя' && el.status !== 'Отказано')
  }

  getJoinedUsers(users: any) {
    return users.filter((el: any) => el.status !== 'Отказано' && el.status !== 'Ожидает подтверждение от водителя')
  }

  getUserStatus(email: string, travel: any) {
    const {status} = travel.joinedUsers.find((el: any) => el.userEmail === email)
    return status
  }

  fakePay(userEmail: string) {
    this.travelService.updateJoinedUserStatus(this.travel._id, userEmail, 'Оплачено').subscribe()
    this.getUserTravels(this.userEmail)
  }

  checkAllUsersPayed() {
    const PayedUsersCount = this.travel.joinedUsers.filter((el: any) => el.status === 'Оплачено').length
    return PayedUsersCount == this.travel.peoplesCount ? true : false
  }

  getTravelStatus() {
    const userStatus = this.getUserStatus(this.userEmail, this.travel)

    if (userStatus === 'Ожидает подтверждение от водителя') {
      return 'Ожидает подтверждение от водителя'
    } else if (userStatus === 'Ожидает оплаты') {
      return 'Ожидает оплаты'
    } else if (userStatus === 'Оплачено') {
      if (this.checkAllUsersPayed()) {
        if (this.travel.status === 'ended') {
          //Нужно добавить условие
          return 'Ожидает отзывы и рейтинг'
        } else {
          return 'Готов к поездке'
        }
      } else {
        return 'Комплектуется'
      }
    } else {
      return userStatus
    }
  }

}
