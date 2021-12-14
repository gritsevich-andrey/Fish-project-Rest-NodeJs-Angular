import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {YaReadyEvent} from "angular8-yandex-maps";

@Component({
  selector: 'app-select-start-point',
  templateUrl: './select-start-point.component.html',
  styleUrls: ['./select-start-point.component.scss']
})
export class SelectStartPointComponent implements OnInit {
  placemarks: any = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.placemarks = this.data.placemarks
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>) {
    let startPointMap = event.target;

    const searchControl = new ymaps.control.SearchControl({options: {provider: 'yandex#map'}});
    searchControl.events.add('resultselect', (e: any) => {
      let results = searchControl.getResultsArray();
      let selected = e.get('index');
      // @ts-ignore
      let [latitude, longitude] = results[selected].geometry.getCoordinates();
      //callback
      this.data.setData(latitude, longitude)
    })
    startPointMap.controls.remove('searchControl');
    startPointMap.controls.add(searchControl);
  }
}
