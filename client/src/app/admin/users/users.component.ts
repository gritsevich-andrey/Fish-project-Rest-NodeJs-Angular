import {Component, OnInit} from '@angular/core';
import {UserService} from "../../shared/services/user.service";
import {Sort} from "@angular/material/sort";

export interface UserData {
    email: string;
    banned: boolean;
}

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    userData: UserData[] = [];
    sortedData!: UserData[];

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
            console.log('Данные в методе сортировки',this.sortedData)
            return;
        }

        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'email': {
                    console.log('Работает метод сортировки по email');
                    return this.compare(a.email, b.email, isAsc);
                }
                // case 'banned': return this.compare(a.banned, b.banned, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: string | number, b: string | number, isAsc: boolean) {
        console.log('Что возвращает метод сравнения', (a < b ? -1 : 1) * (isAsc ? 1 : -1))
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
