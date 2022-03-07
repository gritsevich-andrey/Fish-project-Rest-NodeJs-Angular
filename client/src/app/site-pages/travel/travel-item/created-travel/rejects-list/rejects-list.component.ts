import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {TravelReject} from "../../../../../shared/interfaces";

@Component({
  selector: 'app-rejects-list',
  templateUrl: './rejects-list.component.html',
  styleUrls: ['./rejects-list.component.scss']
})

export class RejectsListComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public rejects: TravelReject[]
  ) {
  }

  ngOnInit(): void {
  }

}
