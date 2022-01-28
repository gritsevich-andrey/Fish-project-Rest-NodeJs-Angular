import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../shared/services/user.service";
import {MaterialService} from "../../../shared/classes/material.service";

interface Complaint {
  description: string,
  _id: string,
  senderEmail: string
}

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email']
      this.getComplaints(params['email'])
    });
  }

  getComplaints(email: string) {
    this.userService.getComplaintByEmail(email).subscribe(
      data => {
        this.complaints = data;
      },
      error => console.log(error));
  }

  deleteComplaint(email: string, id: string) {
    this.userService.deleteComplaintById(email, id).subscribe(
      () => {
        MaterialService.toast('Жалоба удалена')
        this.complaints.map((complaint, index) => {
          if (complaint._id === id)
            this.complaints.splice(index, 1);
        })
      },
      error => console.log(error)
    )
  }
}
