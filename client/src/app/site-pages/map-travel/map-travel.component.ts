import {Component, OnInit} from '@angular/core';
import {YaReadyEvent} from "angular8-yandex-maps";
import {TravelService} from "../../shared/services/travel.service";
import {Travel} from "../../shared/interfaces";
import {EmitterService} from "../../shared/services/emitter.service";

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
  valueRadio: string | undefined;
  travels: Travel[] = [];
  page = 0;
  pageSize = 4;

  constructor(private travelService: TravelService, private emitterService: EmitterService) {
  }


  ngOnInit(): void {
    this.getData();
    this.emitterService.isAuthenticated$.subscribe(authenticated => {
      if (authenticated) {
        this.getData();
      }
    });
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>) {
    this.map = event.target;
  }

  private getData() {
    const titles: any[] = [];
    let newArrays: any[] = [];
    this.travelService.getAllTravels().subscribe(data => {
      this.travels = data;
      console.log('Тревел', data);
      this.travels.forEach(value => {
        titles.push(value.title);
        newArrays = removeDuplicates(titles,'objectKey');
      });
    });
//@ts-ignore
    function removeDuplicates(array, key) {
      let lookup = {};
      console.log(array, 'Внутри функции');
      array.forEach((element: { [x: string]: string | number; }) => {
        console.log(element, 'Внутри функции елемент');
        // @ts-ignore
        lookup[element[key]] = element
      });
      // @ts-ignore
      return Object.keys(lookup).map(key => lookup[key]);
    }

  // removeDuplicates(titles,'objectKey')
    console.log(titles, 'массив');
    console.log(newArrays, 'массив 2');
  }

  changeRadioValue() {
    console.log('радиозначение', this.valueRadio);
  }
}


