import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {YaGeocoderService, YaReadyEvent} from "angular8-yandex-maps";

@Component({
  selector: 'app-select-point',
  templateUrl: './select-point.component.html',
  styleUrls: ['./select-point.component.scss']
})
export class SelectPointComponent implements OnInit {
  placemarks: any = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private yaGeocoderService: YaGeocoderService
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
      this.getPointAddress(latitude, longitude).subscribe((result: any) => {
        let endPointAddress = ''
        const firstGeoObject = result.geoObjects.get(0);
        endPointAddress = firstGeoObject.properties._data.text
        this.data.setData(latitude, longitude, endPointAddress)
      })
    })
    startPointMap.controls.remove('searchControl');
    startPointMap.controls.add(searchControl);
  }

  getPointAddress(latitude: number, longitude: number) {
    return this.yaGeocoderService.geocode([latitude, longitude])
  }
}
