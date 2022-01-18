import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Component, Inject, OnInit} from '@angular/core';
import {YaReadyEvent} from "angular8-yandex-maps";

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

  onMapReady(event: YaReadyEvent<ymaps.Map>) {
    let map = event.target;
    map.controls.remove('fullscreenControl')
  }
}
