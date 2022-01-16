import {Component, OnDestroy, OnInit} from '@angular/core';
import {YaEvent, YaReadyEvent} from "angular8-yandex-maps";
import {TravelService} from "../../shared/services/travel.service";
import {EmitterService} from "../../shared/services/emitter.service";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../shared/services/user.service";
import * as CryptoJS from "crypto-js";
import {AuthService} from "../../shared/services/auth.service";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";

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
export class MapTravelComponent implements OnInit, OnDestroy {
// @ts-ignore
//   https://openbase.com/js/angular8-yandex-maps
//   https://ddubrava.github.io/angular8-yandex-maps/additional-documentation/examples.html
  // https://ru.stackoverflow.com/questions/938768/angular-6-%D0%B8-yandex-map-api
  //https://yandex.ru/dev/maps/jsbox/2.1/object_list
  map: ymaps.Map;
  valueRadio: string | undefined;
  travels: any[] = [];
  travelList: any[] = [];
  page = 0;
  pageSize = 10;
  placemarks: PlacemarkConstructor[] = [];
  email = '';
  // dialogRef: any;
  categoryTravels: string[] = [];
  idTrainForSelect: string[] = [];
  listBorderFlag = false;
  private subTravel?: Subscription;

  constructor(private travelService: TravelService,
              private emitterService: EmitterService,
              public dialog: MatDialog,
              private userService: UserService,
              private authService: AuthService) {
  }

  ngOnDestroy(): void {
    this.map.destroy();
    if(this.subTravel) {
      this.subTravel.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.email = this.userService.getUserDataFromLocal();
    this.getData();
  }

  onMapReady(event: YaReadyEvent<any>) {
    this.map = event.target;

    this.map.events.add('click', (e) => {
      const coords = e.get('coords');
      this.placemarks.push({
        geometry: coords,
        properties: {
          balloonContent:
            '<p>Координаты: ' +
            [coords[0].toPrecision(6), coords[1].toPrecision(6)].join(', ') +
            '</p><p>' + '<a target=_blank href=/create-trip/' + coords + '>Предложить поездку</a></p>',
        },
        options: {
          preset: 'islands#redDotIcon',
          iconColor: 'red',
        }
      })
    });

    ymaps.geolocation
      .get({
        provider: 'yandex',
        mapStateAutoApply: true,
      })
      .then((result: any) => {
        result.geoObjects.options.set('preset', 'islands#redDotIcon');
       const coords = result.geoObjects.position;
        result.geoObjects.get(0).properties.set({
          balloonContentBody:
          '<p> Ваши координаты: ' + coords +
            '</p><p>' + '<a target=_blank href=/create-trip/' + coords + '>Предложить поездку</a></p>',
        });
        this.map.geoObjects.add(result.geoObjects);
        this.map.setZoom(5);
      })
      .catch(() => {
        this.map = new ymaps.Map('map', {
          // При инициализации карты обязательно нужно указать
          // её центр и коэффициент масштабирования.
          center: [55.76, 37.64], // Москва
          zoom: 2
        })
      })
  }

  private getData() {
  this.subTravel = this.travelService.getAllTravels()
    .pipe(
        map(value => {
          let arrayValues: any[] = [];
          value.map((data: any) => {
            const tempDataObj = {
              address: data.address,
              costPerPeople: data.costPerPeople,
              date: data.date,
              description: data.description,
              endPoint: data.endPoint,
              imageSrc: data.imageSrc,
              name: data.name,
              peoplesCount: data.peoplesCount,
              title: data.title,
              travelTarget: data.travelTarget,
              travelTechnique: data.travelTechnique,
              userEmail: data.userEmail,
              _id: data._id,
              url: this.createBCryptUrl(data.userEmail, data._id)
            };
            arrayValues.push(tempDataObj);
          })
          return arrayValues;
        })
      )
      .subscribe(data => {
        this.travels = data;
        this.getUniqueCategory();
      });
  }

  private getUniqueCategory() {
    let category: string[] = [];
    this.travels.forEach(value => {
      category.push(value.title);
    });
    const uniq = new Set(category);
    this.categoryTravels = [...uniq];
  }

  onMouse(event: YaEvent<ymaps.Placemark>, type: "enter" | "leave"): void {
    const {options} = event.target;
    switch (type) {
      case 'enter':
        options.set('preset', 'islands#greenIcon');
        break;

      // case 'leave':
      //   options.unset('preset');
      //   break;
    }
  }

  createBCryptUrl(userEmail: string, _id: string) {
    if (userEmail === this.email) {
      return 1;
    } else {
      const pass = this.authService.getToken();
      const data = `${userEmail}/${_id}/${this.email}`
      const dataCrypt = CryptoJS.AES.encrypt(data, pass).toString();
      const pattern = "/";
      const re = new RegExp(pattern, "g");
      const srtNonHyphen = String(dataCrypt.replace(re, '%2F'));
      return srtNonHyphen;
    }
  }

  onMapClick(e: YaEvent<ymaps.Map>): void {
    const {target, event} = e;
    if (!target.balloon.isOpen()) {
      const coords = event.get('coords');
      target.balloon.open(coords, {
        contentHeader: '<label class="mat-card-subtitle">Ваша метка<label>',
        contentBody:
          '<p>Координаты: ' +
          [coords[0].toPrecision(6), coords[1].toPrecision(6)].join(', ') +
          '</p>' + '<a target=_blank href=/create-trip/' + coords + '>Предложить поездку</a>',
        contentFooter: '<sup></sup>',
      });
    } else {
      target.balloon.close();
    }
  }

  onContextMenu(event: YaEvent, id: string) {
    const {options} = event.target;
    let replayedClick = false;
    let arrayIds: string[] = this.idTrainForSelect;
    arrayIds.forEach((value, idx) => {
      if (value === id) {
        arrayIds.splice(idx, 1);
        replayedClick = true;
      }
    })
    if(!replayedClick) {
      arrayIds.push(id);
      options.set('preset', 'islands#blueCircleDotIcon');
    }
    else {
      options.set('preset', 'islands#orangeDotIcon');
    }
    this.idTrainForSelect = [...new Set(arrayIds)];
    this.createTravelList();
  }
  createTravelList() {
    this.travelList = [];
    let newList = [];
    if(this.idTrainForSelect.length > 0) {
      for (let id of this.idTrainForSelect) {
      const travelList = this.travels.filter(value => value._id === id);
        for (let travelListElement of travelList) {
          newList.push(travelListElement)
        }
      }
    }
    this.travelList = newList;
  }

  setDefaultSettings() {
    this.travelList=[]; this.listBorderFlag=false;
  }
}
