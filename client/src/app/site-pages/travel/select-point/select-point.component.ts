import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {YaGeocoderService, YaReadyEvent} from "angular8-yandex-maps";

@Component({
  selector: 'app-select-point',
  templateUrl: './select-point.component.html',
  styleUrls: ['./select-point.component.scss']
})
export class SelectPointComponent {
  placemark: any = {}
  address = ''

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private yaGeocoderService: YaGeocoderService,
    private dialog: MatDialogRef<any>
  ) {
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>) {
    let map = event.target;

    if (!this.data?.placemark) {
      ymaps.geolocation
        .get({
          provider: 'yandex',
          mapStateAutoApply: true,
        })
        .then((result) => {
          //@ts-ignore
          map.setCenter(result.geoObjects.position)
        });
    } else {
      this.placemark = this.data.placemark
      map.setCenter(this.data.placemark.geometry)
    }

    const searchControl = new ymaps.control.SearchControl({options: {provider: 'yandex#map', noPlacemark: true}});
    searchControl.events.add('resultselect', (e: any) => {
    })

    map.events.add('click', (e) => {
      const coords = e.get('coords');
      this.placemark.geometry = coords

      this.getPointAddress(coords[0], coords[1]).subscribe((result: any) => {
        const firstGeoObject = result.geoObjects.get(0);
        this.address = firstGeoObject.properties._data.text
      })
    })

    map.controls.remove('searchControl');
    map.controls.add(searchControl);
  }

  getPointAddress(latitude: number, longitude: number) {
    return this.yaGeocoderService.geocode([latitude, longitude])
  }

  confirm() {
    this.dialog.close({
      latitude: this.placemark.geometry[0],
      longitude: this.placemark.geometry[1],
      address: this.address
    });
  }
}
