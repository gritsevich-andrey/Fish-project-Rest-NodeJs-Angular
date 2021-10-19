import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../shared/services/user.service";

interface Complains {
  complaintDescription: string,
  complaintId: string
}

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {
  complains: Complains[] = [];
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  getComplaints(email: string) {
    this.userService.getComplaintByEmail(email).subscribe(
      data => {
        this.complains = data;
        console.log(data)
      },
      error => console.log(error));
  }

  deleteComplaint(email: string, id: string) {
    this.userService.deleteComplaintById(email, id).subscribe(
      data => {
        console.log(data)
        this.getComplaints(email)
      }
    )
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email']
      this.getComplaints(params['email'])
    });
  }

}
