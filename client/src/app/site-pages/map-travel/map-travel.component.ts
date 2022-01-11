import {Component, OnInit} from '@angular/core';
import {YaEvent, YaReadyEvent} from "angular8-yandex-maps";
import {TravelService} from "../../shared/services/travel.service";
import {Travel} from "../../shared/interfaces";
import {EmitterService} from "../../shared/services/emitter.service";
import {CreateTravelModalComponent} from "../travel/create-travel-modal/create-travel-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../shared/services/user.service";
import * as CryptoJS from "crypto-js";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";

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
  private objectManager: any;
  //@ts-ignore
  private activeObjectMonitor: ymaps.Monitor;

  constructor(private travelService: TravelService,
              private emitterService: EmitterService,
              public dialog: MatDialog,
              private userService: UserService,
              private authService: AuthService,
              private router: Router) {
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
    });

    ymaps.geolocation
      .get({
        provider: 'yandex',
        mapStateAutoApply: true,
      })
      .then((result) => {
        // We'll mark the position calculated by IP in red.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon');
        result.geoObjects.get(0).properties.set({
          balloonContentBody: 'My location',
        });
        this.map.geoObjects.add(result.geoObjects);
      });

    ymaps.geolocation
      .get({
        provider: 'browser',
        mapStateAutoApply: true,
      })
      .then((result) => {
        /**
         * We'll mark the position obtained through the browser in blue.
         * If the browser does not support this functionality, the placemark will not be added to the map.
         */
        result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
        this.map.geoObjects.add(result.geoObjects);
      });
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
    const {options} = event.target;

    switch (type) {
      case 'enter':
        options.set('preset', 'islands#greenIcon');
        break;

      case 'leave':
        options.unset('preset');
        break;
    }
  }

  createTrip() {
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

  goJoin(userEmail: string, _id: string) {
    const email = this.userService.getUserDataFromLocal();
    const pass = this.authService.getToken();
    const data = `${userEmail}/${_id}/${email}`
    const dataCrypt = CryptoJS.AES.encrypt(data, pass).toString();
    this.router.navigate(['/join', dataCrypt]);
  }
}
