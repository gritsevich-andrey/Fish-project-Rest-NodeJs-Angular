import {Component, OnDestroy, OnInit} from '@angular/core';
import {YaEvent, YaReadyEvent} from "angular8-yandex-maps";
import {TravelService} from "../../shared/services/travel.service";
import {EmitterService} from "../../shared/services/emitter.service";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../shared/services/user.service";
import * as CryptoJS from "crypto-js";
import {AuthService} from "../../shared/services/auth.service";
import {debounceTime, map} from "rxjs/operators";
import {Subscription} from "rxjs";
import {Travel} from "../../shared/interfaces";
import {CabinetService} from "../cabinet/cabinet.service";
import {WarningService} from "../../shared/services/warning.service";


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
  travels: Travel[] = [];
  travelList: any[] = [];
  page = 0;
  pageSize = 10;
  placemarks: any;
  email = '';
  // dialogRef: any;
  categoryTravels: string[] = [];
  idTrainForSelect: string[] = [];
  listBorderFlag = false;
  allCabinetsInfo: any[] = [];
  private subTravel?: Subscription;

  constructor(private travelService: TravelService,
              private emitterService: EmitterService,
              public dialog: MatDialog,
              private userService: UserService,
              private authService: AuthService,
              private cabinetService: CabinetService,
              private warningService: WarningService) {
    this.placemarks = {};
  }

  ngOnDestroy(): void {
    this.map.destroy();
    if (this.subTravel) {
      this.subTravel.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.email = this.userService.getUserDataFromLocal();
    this.getData();
  }

  onMapReady(event: YaReadyEvent) {
    this.map = event.target;
    this.createMapBalloon();
    this.getCenterMapByIP();
  }

  private createMapBalloon() {
    this.map.events.add('click', (e) => {
      const coords = e.get('coords');
      this.placemarks = {
        geometry: coords,
        properties: {
          balloonContent:
            '<p>Координаты: ' +
            [coords[0].toPrecision(6), coords[1].toPrecision(6)].join(', ') +
            '</p><p>' + '<a target=_blank href=/create-trip/' + coords + '>Организовать поездку</a></p>',
        },
        options: {
          preset: 'islands#redDotIcon',
          iconColor: 'red'
        }
      }
    });
  }

  private getCenterMapByIP() {
    ymaps.geolocation
      .get({
        provider: 'yandex',
        mapStateAutoApply: false,
      })
      .then((result: any) => {
        result.geoObjects.options.set('preset', 'islands#greenDotIcon');
        const coords = result.geoObjects.position;
        result.geoObjects.get(0).properties.set({
          balloonContentBody:
            '<p> Ваши координаты: ' + coords +
            '</p><p>' + '<a target=_blank href=/create-trip/' + coords + '>Организовать поездку</a></p>',
        });
        this.map.geoObjects.add(result.geoObjects);
        this.map.setZoom(3);
      })
      .catch(() => {
        this.map = new ymaps.Map('map', {
          // При инициализации карты обязательно нужно указать
          // её центр и коэффициент масштабирования.
          center: [55.76, 37.64], // Москва
          zoom: 3
        })
      })
  }

  private getData() {
    this.cabinetService.getAllCabinets().subscribe(data => {
      //@ts-ignore
      this.allCabinetsInfo = data;
      this.getAllTravels();
    });
  }

  private getAllTravels() {
    this.subTravel = this.travelService.getAllTravels()
      .pipe(
        debounceTime(500),
        map(value => {
          return this.modifyTravelsData(value);
        })
      )
      .subscribe(data => {
        if (this.travels) {
          this.travels = [];
        }
        this.travels = data;
        this.getUniqueCategory();
      });
  }

  private modifyTravelsData(value: Array<any>) {
    let arrayValues: any[] = [];
    value.map((data: any) => {
      const tempDataObj = {
        address: data.address,
        fromAddress: data.fromAddress,
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
        organizerInfo: this.getOrganizerInfo(data.userEmail),
        _id: data._id,
        url: this.createBCryptUrl(data.userEmail, data._id)
      };
      arrayValues.push(tempDataObj);
    })
    return arrayValues;
  }

  private getUniqueCategory(): void {
    let category: string[] = [];
    this.travels.forEach(value => {
      category.push(value.title);
    });
    const uniq = new Set(category);
    this.categoryTravels = [...uniq];
  }

  onMouse(event: YaEvent<ymaps.Placemark>, type: "enter"): void {
    const {options} = event.target;
    switch (type) {
      case 'enter':
        options.set('preset', 'islands#greenIcon');
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
      return String(dataCrypt.replace(re, '%2F'));
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
          '</p>' + '<a target=_blank href=/create-trip/' + coords + '>Организовать поездку</a>',
        contentFooter: '<sup></sup>',
      })
        .catch()
        .catch(err => console.error('Ошибка map', err));
    } else {
      target.balloon.close()
        .then()
        .catch(error => console.error('Ошибка map', error));
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
    if (!replayedClick) {
      arrayIds.push(id);
      options.set('preset', 'islands#blueCircleDotIcon');
    } else {
      options.set('preset', 'islands#orangeDotIcon');
    }
    this.idTrainForSelect = [...new Set(arrayIds)];
    this.createTravelList();
  }

  createTravelList() {
    this.travelList = [];
    let newList = [];
    if (this.idTrainForSelect.length > 0) {
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
    this.travelList = [];
    this.listBorderFlag = false;
  }
  getOrganizerInfo(organizerEmail: string) {
    let organizerInfo = {
      fio: '',
      age: 0,
      sumRating: 0,
      templateRatings: ''
    };
    this.allCabinetsInfo.map(value => {
      if (organizerEmail === value.email) {
        organizerInfo.fio = value.fio;
        organizerInfo.age = value.age;
        const ratings = value.ratings;
       const sumRatings = ratings.map((value: { sumValue: number; }) => value.sumValue)
        const sumRating = sumRatings.reduce((prev: number, next: number) => {
          return (prev + next)/2;
        });
        organizerInfo.sumRating = parseFloat(sumRating.toFixed(1));
      }
    })
    // @ts-ignore
    for (let i =0; i< parseInt(organizerInfo.sumRating); i++) {
      organizerInfo.templateRatings += `★`
    }
    return organizerInfo;
  }

  getMessageChat() {
    this.warningService.sendWarning(`Сообщение отравлено организатору`);
  }
}
