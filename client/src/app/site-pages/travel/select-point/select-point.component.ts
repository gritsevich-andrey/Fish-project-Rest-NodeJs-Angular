import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {YaGeocoderService, YaReadyEvent} from "angular8-yandex-maps";

@Component({
  selector: 'app-select-point',
  templateUrl: './select-point.component.html',
  styleUrls: ['./select-point.component.scss']
})
export class SelectPointComponent implements OnInit {
  placemark: any = {}
  address = ''

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private yaGeocoderService: YaGeocoderService,
    private dialog: MatDialogRef<any>
  ) {
  }

  ngOnInit(): void {
    this.placemark = this.data.placemarks[0]
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>) {
    let map = event.target;

    // const searchControl = new ymaps.control.SearchControl({options: {provider: 'yandex#map'}
    const searchControl = new ymaps.control.SearchControl({options: {provider: 'yandex#map', noPlacemark: true}});
    searchControl.events.add('resultselect', (e: any) => {
      // let results = searchControl.getResultsArray();
      // let selected = e.get('index');
      // // @ts-ignore
      // let [latitude, longitude] = results[selected].geometry.getCoordinates();
      // this.getPointAddress(latitude, longitude).subscribe((result: any) => {
      //   let endPointAddress = ''
      //   const firstGeoObject = result.geoObjects.get(0);
      //   endPointAddress = firstGeoObject.properties._data.text
      //   this.data.setData(latitude, longitude, endPointAddress)
      // })
    })

    map.events.add('click', (e) => {
      const coords = e.get('coords');
      this.placemark.geometry = coords

      this.getPointAddress(coords[0], coords[1]).subscribe((result: any) => {
        const firstGeoObject = result.geoObjects.get(0);
        this.address = firstGeoObject.properties._data.text
        // this.data.setData((coords[0], coords[1], address))
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
