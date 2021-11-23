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
  valueRadio: string| undefined;
  travels: Travel[]=[];

  placemarkProperies: ymaps.IPlacemarkProperties = {
    balloonContentHeader: 'The placemark balloon',
    balloonContentBody: 'Content of the <em>placemark</em> balloon',
    balloonContentFooter: 'Basement',
    hintContent: 'The placemark hint',
  };

  constructor(private travelService: TravelService, private emitterService: EmitterService) { }

  ngOnInit(): void {
    this.getData();
    this.emitterService.isAuthenticated$.subscribe(authenticated => {
      if (authenticated) {
        this.getData();
      }
    });
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>) {
    const map = event.target;
    this.map = map;
    // map.balloon.open([51.85, 38.37], 'Balloon content', {
    //   // Option: do not show the close button.
    //   closeButton: false,
    // });

    // Showing the hint on the map (without binding to the geo object).
    // map.hint.open(map.getCenter(), 'Lone hint without a placemark', {
    //   // Option: delay before opening.
    //   openTimeout: 1500,
    // });
  }

  private getData() {
    this.travelService.getAllTravels().subscribe(data => {
      this.travels = data;
    });
  }
  changeRadioValue() {
    console.log('радиозначение', this.valueRadio);
  }
}
