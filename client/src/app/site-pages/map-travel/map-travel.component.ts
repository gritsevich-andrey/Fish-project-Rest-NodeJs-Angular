import {Component, OnInit} from '@angular/core';
import {YaEvent, YaReadyEvent} from "angular8-yandex-maps";
import {TravelService} from "../../shared/services/travel.service";
import {EmitterService} from "../../shared/services/emitter.service";
import {CreateTravelModalComponent} from "../travel/create-travel-modal/create-travel-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../shared/services/user.service";
import * as CryptoJS from "crypto-js";
import {AuthService} from "../../shared/services/auth.service";
import {WarningService} from "../../shared/services/warning.service";
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
  // https://ru.stackoverflow.com/questions/938768/angular-6-%D0%B8-yandex-map-api
  map: ymaps.Map;
  valueRadio: string | undefined;
  travels: any[] = [];
  page = 0;
  pageSize = 10;
  placemarks: PlacemarkConstructor[] = [];
email = '';
  categoryTravels: string[] = [];

  constructor(private travelService: TravelService,
              private emitterService: EmitterService,
              public dialog: MatDialog,
              private userService: UserService,
              private authService: AuthService,
              private warningService: WarningService) {
  }

  ngOnInit(): void {
    this.email = this.userService.getUserDataFromLocal();
    this.getData();
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
        result.geoObjects.options.set('preset', 'islands#redDotIcon');
        result.geoObjects.get(0).properties.set({
          balloonContentBody: 'Вы здесь',
        });
        this.map.geoObjects.add(result.geoObjects);
      });
    // @ts-ignore
    this.map.setBounds(this.map.geoObjects.getBounds(), {checkZoomRange:true}).then(() =>{
      if(this.map.getZoom() > 15) this.map.setZoom(15); // Если значение zoom превышает 15, то устанавливаем 15.
    });


    const objectManager = new ymaps.ObjectManager({
     // Включаем кластеризацию.
     clusterize: true,
      // @ts-ignore
     clusterHasBalloon: false,
     // Опции геообъектов задаются с префиксом 'geoObject'.
     geoObjectOpenBalloonOnClick: true
   });
   objectManager.objects.balloon.events.add('click', function (e) {
console.log('Привет');
    });
  }

  private getData() {
    this.travelService.getAllTravels().subscribe(data => {
      let tempDataObj = {};
      data.map((value: any) => {
        tempDataObj = {
          address: value.address,
          costPerPeople: value.costPerPeople,
          date: value.date,
          description:  value.description,
          endPoint: value.endPoint,
          imageSrc: value.imageSrc,
          name: value.name,
          peoplesCount: value.peoplesCount,
          title: value.title,
          travelTarget: value.travelTarget,
          travelTechnique: value.travelTechnique,
          userEmail: value.userEmail,
          id: value._id,
          url: this.createBCryptUrl(value.userEmail, value._id)
        };
        this.travels.push(tempDataObj);
      })
      let category: string[] = [];
      this.travels.forEach(value => {
        category.push(value.title);
      });
      const uniq = new Set(category);
      this.categoryTravels = [...uniq];
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
    console.log('Привет');
    const dialogRef = this.dialog.open(CreateTravelModalComponent,
      {
        data: {
          userEmail: email
        }
      }
    );
    dialogRef.afterClosed().subscribe();
  }

  createBCryptUrl(userEmail: string, _id: string) {
    if (userEmail === this.email) {
      this.warningService.sendWarning('Вы не можете присоединиться к своей поездке');
      return '';
    }
    else {
      const pass = this.authService.getToken();
      const data = `${userEmail}/${_id}/${this.email}`
      const dataCrypt = CryptoJS.AES.encrypt(data, pass).toString();
      // const bCryptUrl = `<a href="/join/${dataCrypt}" target="_blank"> <br/> Присоединиться к поездке</a>`;
      return dataCrypt;
    }
  }
}
