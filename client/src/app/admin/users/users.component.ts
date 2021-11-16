import {Component, OnInit} from '@angular/core';
import {UserService} from "../../shared/services/user.service";
import {Sort} from "@angular/material/sort";
import {EmitterService} from "../../shared/services/emitter.service";

declare var M: { FormSelect: { init: (arg0: NodeListOf<Element>) => any; }; }

export interface UserData {
  email: string;
  banned: boolean;
  date?: string;
  fio?: string;
  id: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userData: UserData[] = [];
  sortedData!: UserData[];
  page: number = 1;
  usersOnPage!: number;
  defaultUsersOnPage: number = 10;
  searchValue!: string;

  constructor(private userService: UserService, public emitterService: EmitterService ) {
  }

  ngOnInit(): void {
    this.initFormSelect()
    this.getListUsers();

    this.emitterService.change$.subscribe(state => console.log('подписка в поездках', state));
    this.emitterService.isAuthenticated$.subscribe(authenticated => {
      if (authenticated) {
        console.log('Аутентификация')
      }
    });
  }

  //Может сделать приватными методами?
  getListUsers() {
    this.userService.getListUsers().subscribe(
      data => {
        this.userData = data;
        this.sortedData = this.userData.slice();
      },
      error => console.log(error));
  }

  initFormSelect() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }

  sortData(sort: Sort) {
    const data = this.userData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'email': {
          return this.compare(a.email, b.email, isAsc);
        }
        // case 'banned': return this.compare(a.banned, b.banned, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  banUserByEmail(email: string, index: number) {
    this.userService.banUserByEmail(email).subscribe(
      data => {
        console.log(data)
        this.sortedData[index].banned = true;
      },
      error => console.log(error));
  }

  unBanUserByEmail(email: string, index: number) {
    this.userService.unBanUserByEmail(email).subscribe(
      data => {
        console.log(data)
        this.sortedData[index].banned = false;
      },
      error => console.log(error));
  }
}
