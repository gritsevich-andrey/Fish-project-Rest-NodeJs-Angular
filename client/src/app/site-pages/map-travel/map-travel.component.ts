import {Component, OnInit} from '@angular/core';
import {YaReadyEvent} from "angular8-yandex-maps";
import {TravelService} from "../../shared/services/travel.service";
import {Travel} from "../../shared/interfaces";


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
  searchPlace: string | undefined;
  travels: Travel[]=[];

  constructor(private travelService: TravelService) { }

  ngOnInit(): void {
    this.getData();
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>) {
    this.map = event.target;
  }

  private getData() {
    this.travelService.getAllTravels().subscribe(data => {
      this.travels = data;
      console.log('Получаем объекты', this.travels)
    });
  }
}
