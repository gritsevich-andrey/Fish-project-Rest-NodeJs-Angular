import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {UserService} from "../../shared/services/user.service";

export interface PeriodicElement {
    email: any
}

//const ELEMENT_DATA: PeriodicElement[] = [];

/**
 * @title Table with sorting
 */
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements AfterViewInit, OnInit {
    ELEMENT_DATA: PeriodicElement[] = [];
    displayedColumns: string[] = ['email'];
    dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    listEmails: any[] = [];

    constructor(private userService: UserService) {

    }

    ngOnInit(): void {
        this.userService.getListUsers().subscribe(emails => {
                console.log(emails);
                this.ELEMENT_DATA = emails
                console.log(this.ELEMENT_DATA);
            },
            error => console.log(error));
        console.log('Лист email', this.listEmails)
    }

    //@ts-ignore
    @ViewChild(MatSort) sort: MatSort;

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }
}
