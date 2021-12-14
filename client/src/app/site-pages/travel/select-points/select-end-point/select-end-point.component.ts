import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {YaGeocoderService, YaReadyEvent} from "angular8-yandex-maps";

@Component({
  selector: 'app-select-end-point',
  templateUrl: './select-end-point.component.html',
  styleUrls: ['./select-end-point.component.scss']
})
export class SelectEndPointComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private yaGeocoderService: YaGeocoderService
  ) {
  }

  ngOnInit(): void {
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
        this.data.setCoordinates(endPointAddress, latitude, longitude)
      })
    })
    startPointMap.controls.remove('searchControl');
    startPointMap.controls.add(searchControl);
  }

  getPointAddress(latitude: number, longitude: number) {
    return this.yaGeocoderService.geocode([latitude, longitude])
  }
}
