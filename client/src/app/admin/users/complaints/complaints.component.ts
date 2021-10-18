import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {
  complains: string[] = [];
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  getComplaints(email: string) {
    this.userService.getComplaintByEmail(email).subscribe(
      data => {
        this.complains = data;
      },
      error => console.log(error));
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email']
      this.getComplaints(params['email'])
    });
  }

}
