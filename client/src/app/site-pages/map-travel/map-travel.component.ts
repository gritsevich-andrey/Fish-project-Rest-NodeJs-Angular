import {Component, OnInit} from '@angular/core';
import {YaReadyEvent} from "angular8-yandex-maps";


@Component({
  selector: 'app-map-travel',
  templateUrl: './map-travel.component.html',
  styleUrls: ['./map-travel.component.scss']
})
export class MapTravelComponent implements OnInit {
// @ts-ignore
//   https://openbase.com/js/angular8-yandex-maps
//   https://ddubrava.github.io/angular8-yandex-maps/additional-documentation/examples.html
  map: ymaps.Map;
  favoriteSeason: string| undefined;
  places: string[] = ['р. Обь. На щуку', 'Окунь. район Салехарда', 'Охота на оленя. Красное'];
  constructor() { }

  ngOnInit(): void {
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>) {
    this.map = event.target;
  }
}
