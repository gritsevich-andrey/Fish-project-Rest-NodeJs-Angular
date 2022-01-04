import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {YaGeocoderService, YaReadyEvent} from "angular8-yandex-maps";

@Component({
  selector: 'app-set-point-map',
  templateUrl: './set-point-map.component.html',
  styleUrls: ['./set-point-map.component.scss']
})
export class SetPointMapComponent implements OnInit {
  address!: string;
  latitude!: string;
  longitude!: string;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private yaGeocoderService: YaGeocoderService
  ) {
  }

  ngOnInit(): void {
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>) {
    let map = event.target

    const searchControl = new ymaps.control.SearchControl({options: {provider: 'yandex#map'}});
    searchControl.events.add('resultselect', (e: any) => {
      let results = searchControl.getResultsArray();
      let selected = e.get('index');
      // @ts-ignore
      let [latitude, longitude] = results[selected].geometry.getCoordinates();
      this.latitude = latitude
      this.longitude = longitude
      this.getAddress(latitude, longitude).subscribe((result: any) => {
        const GeoObject = result.geoObjects.get(0);
        this.address = GeoObject.properties._data.text
      })
    })
    map.controls.remove('searchControl');
    map.controls.add(searchControl);
  }

  getAddress(latitude: number, longitude: number) {
    return this.yaGeocoderService.geocode([latitude, longitude])
  }

  submit() {
    this.dialogRef.close({latitude: this.latitude, longitude: this.longitude, address: this.address});
  }
}
