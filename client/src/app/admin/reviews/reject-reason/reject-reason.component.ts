import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-reject-reason',
  templateUrl: './reject-reason.component.html',
  styleUrls: ['./reject-reason.component.scss']
})
export class RejectReasonComponent implements OnInit {
  deleteReason!: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  deleteReview() {

  }
}
