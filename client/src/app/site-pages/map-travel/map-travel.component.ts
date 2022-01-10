import {Component, OnInit} from '@angular/core';
import {YaEvent, YaReadyEvent} from "angular8-yandex-maps";
import {TravelService} from "../../shared/services/travel.service";
import {Travel} from "../../shared/interfaces";
import {EmitterService} from "../../shared/services/emitter.service";
import {CreateTravelModalComponent} from "../travel/create-travel-modal/create-travel-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../shared/services/user.service";

interface PlacemarkConstructor {
  geometry: number[];
  properties: ymaps.IPlacemarkProperties;
  options: ymaps.IPlacemarkOptions;
}

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
  pageSize = 10;
  placemarks: PlacemarkConstructor[] = [];
  constructor(private travelService: TravelService,
              private emitterService: EmitterService,
              public dialog: MatDialog,
              private userService: UserService) {
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
    this.map.events.add('click', (e) => {
      const coords = e.get('coords');
this.placemarks.push({
  geometry: coords,
  properties: {
    balloonContent: '<a href=/travel/1 target="_blank">' + 'Предложить поездку' + '</a>',
  },
  options: {
    preset: 'islands#circleDotIcon',
    iconColor: 'yellow',
  }
})
    })
  }

  private getData() {
    const titles: any[] = [];
    this.travelService.getAllTravels().subscribe(data => {
      this.travels = data;
      this.travels.forEach(value => {
        titles.push(value.title);
      });
    });
  }
  onMouse(event: YaEvent<ymaps.Placemark>, type: 'enter' | 'leave'): void {
    const { options } = event.target;

    switch (type) {
      case 'enter':
        options.set('preset', 'islands#greenIcon');
        break;

      case 'leave':
        options.unset('preset');
        break;
    }
  }
  createTrip(){
    const email = this.userService.getUserDataFromLocal();
    const dialogRef = this.dialog.open(CreateTravelModalComponent,
      {
        data: {
          userEmail: email
        }
      }
    );
   dialogRef.afterClosed().subscribe();
  }
}
function createTrip() {
  console.log('Читаем');
}
