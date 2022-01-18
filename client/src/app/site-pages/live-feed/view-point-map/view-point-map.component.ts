import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Component, Inject, OnInit} from '@angular/core';

@Component({
  selector: 'app-view-point-map',
  templateUrl: './view-point-map.component.html',
  styleUrls: ['./view-point-map.component.scss']
})
export class ViewPointMapComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
  }
}
