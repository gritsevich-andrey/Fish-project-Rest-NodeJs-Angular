import {Component, OnInit} from '@angular/core';
import {UserService} from "../../shared/services/user.service";
import {Sort} from "@angular/material/sort";

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
  query!: string;

  public searchFilter: any = '';

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getListUsers().subscribe(
      data => {
        this.userData = data;
        this.sortedData = this.userData.slice();
      },
      error => console.log(error));
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

  /*
  getComplaints(email: string) {
    this.userService.getComplaintByEmail(email).subscribe(
      data => {
        console.log(data)
      },
      error => console.log(error));
  }
  */


  /*
  createComplaints(email: string, description: string) {
    this.userService.createComplaintByEmail(email, description).subscribe(
      data => {
        console.log(data)
      },
      error => console.log(error));
  }
  */

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
