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

  constructor(
    public travelService: TravelService
  ) {
  }

  ngOnInit(): void {
  }

  getAcceptedUsers() {
    return this.travel.joinedUsers.filter(el => el.status !== 'Ожидает подтверждение от водителя' && el.status !== 'Отказано')
  }

  getJoinedUsers() {
    return this.travel.joinedUsers.filter((el: any) => el.status !== 'Отказано' && el.status !== 'Ожидает подтверждение от водителя')
  }

  getUserStatus() {
    // @ts-ignore
    const {status} = this.travel.joinedUsers.find((el: any) => el.userEmail === this.userEmail)
    return status
  }

  fakePay() {
    this.travelService.updateUserStatus(this.travel._id, this.userEmail, 'Оплачено').subscribe(
      () => this.getUserTravels(this.userEmail),
      error => console.log(error)
    )
  }

  checkAllUsersPayed() {
    const PayedUsersCount = this.travel.joinedUsers.filter((el: any) => el.status === 'Оплачено').length
    return PayedUsersCount == this.travel.peoplesCount ? true : false
  }

  getTravelStatus() {
    const userStatus = this.getUserStatus()

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

  getRejectReason() {
    //@ts-ignore
    const {comment} = this.travel.joinedUsers.find((el: any) => el.userEmail === this.userEmail)
    return comment
  }
}
