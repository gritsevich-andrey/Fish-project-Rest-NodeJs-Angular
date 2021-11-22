import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {TravelService} from "../../shared/services/travel.service";
import {YaGeocoderService, YaReadyEvent} from "angular8-yandex-maps";
import {CabinetService} from "../cabinet/cabinet.service";
import {MaterialService} from "../../shared/classes/material.service";

declare var M: {
  FormSelect: { init: (arg0: NodeListOf<Element>) => any; },
  Modal: { init: (arg0: NodeListOf<Element>) => any; }
}

interface Travel {
  userEmail: string
  travelType: string
  travelTarget: string
  peoplesCount: string
  costPerPeople: string
  description: string
  title: string
  coordinates: string
  isPublic: boolean
  _id: string
}

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements OnInit {
  //@ts-ignore
  startPointMap: ymaps.Map;
  startPointLatitude!: number
  startPointLongitude!: number
  //@ts-ignore
  endPointMap: ymaps.Map;
  endPointLatitude!: number;
  endPointLongitude!: number

  form!: FormGroup;
  userEmail!: string
  userTravels: Travel[] = []
  isTechnique = false
  transports: any = []

  constructor(
    private userService: UserService,
    private travelService: TravelService,
    private cabinetService: CabinetService,
    private yaGeocoderService: YaGeocoderService
  ) {
    this.form = new FormGroup({
      travelType: new FormControl(''),
      travelTarget: new FormControl(''),
      peoplesCount: new FormControl(''),
      costPerPeople: new FormControl(''),
      description: new FormControl(''),
      travelTitle: new FormControl(''),
      travelTechnique: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.userEmail = this.userService.getUserDataFromLocal()
    this.initMaterialize()
    this.getUserTravels(this.userEmail)
  }


  initMaterialize() {
    const modals = document.querySelectorAll('.modal');
    const selects = document.querySelectorAll('select');
    M.Modal.init(modals);
    M.FormSelect.init(selects);
  }

  getUserTravels(userEmail: string) {
    this.travelService.getUserTravels(userEmail).subscribe(
      data => this.userTravels = data,
      error => console.log(error)
    )
  }

  hideTravel(travelId: string) {
    let travelData = this.userTravels.filter((el: any) => el._id === travelId)
    //@ts-ignore
    travelData[0].isPublic = false;
    this.travelService.updateTravel(travelId, travelData[0]).subscribe(
      () => this.getUserTravels(this.userEmail),
      error => console.log(error)
    )
  }

  showTravel(travelId: string) {
    let travelData = this.userTravels.filter((el: any) => el._id === travelId)
    //@ts-ignore
    travelData[0].isPublic = true;
    this.travelService.updateTravel(travelId, travelData[0]).subscribe(
      () => this.getUserTravels(this.userEmail),
      error => console.log(error)
    )
  }

  createTravel() {
    let travelData = {
      userEmail: this.userEmail,
      travelType: this.form.controls.travelType.value,
      travelTarget: this.form.controls.travelTarget.value,
      peoplesCount: this.form.controls.peoplesCount.value,
      costPerPeople: this.form.controls.costPerPeople.value,
      description: this.form.controls.description.value,
      title: this.form.controls.travelTitle.value,
      coordinates: {
        startPoint: {
          latitude: this.startPointLatitude,
          longitude: this.startPointLongitude
        },
        endPoint: {
          latitude: this.endPointLatitude,
          longitude: this.endPointLongitude
        }
      },
      travelTechnique: this.form.controls.travelTechnique.value
    }
    if (this.checkIsFormEmpty()) {
      this.travelService.createTravel(travelData).subscribe(
        () => {
          this.form.reset();
          this.getUserTravels(this.userEmail);
          MaterialService.toast('Ваша поездка сохранена')
        },
        error => console.log(error)
      )
    }
  }

  checkIsFormEmpty() {
    //Костыльная проверка заполненности формы
    let count = 0
    let count1 = 0
    const button = document.getElementById('button-modal-close')

    for (let item in this.form.controls) {
      count++
    }
    for (let item in this.form.controls) {
      //@ts-ignore
      if (this.form.controls[item].value) count1++
    }
    if (count1 === count && this.startPointLatitude && this.startPointLongitude && this.endPointLatitude && this.endPointLongitude) {
      //@ts-ignore
      button.classList.add('modal-close')
      //@ts-ignore
      button.click()
      return false
    } else if (count1 + 1 === count && this.startPointLatitude && this.startPointLongitude && this.endPointLatitude && this.endPointLongitude && this.form.controls.travelType.value === "onFoot") {
      //@ts-ignore
      button.classList.add('modal-close')
      //@ts-ignore
      button.click()
      return false
    } else {
      //@ts-ignore
      button.classList.remove('modal-close')
      MaterialService.toast('Заполните все поля')
      return true
    }
  }

  onStartPointMapReady(event: YaReadyEvent<ymaps.Map>) {
    this.startPointMap = event.target;

    this.startPointMap.events.add('click', (e) => {
      let coords = e.get("coords")
      this.startPointLatitude = coords[0]
      this.startPointLongitude = coords[1]
    })
  }

  onEndPointMapReady(event: YaReadyEvent<ymaps.Map>) {
    this.endPointMap = event.target;

    this.endPointMap.events.add('click', (e) => {
      let coords = e.get("coords")
      this.endPointLatitude = coords[0]
      this.endPointLongitude = coords[1]
    })
  }

  loadTransport() {
    this.cabinetService.getTransportByEmail(this.userEmail).subscribe(
      data => this.transports = data
    )
  }

  travelTypeChange() {
    if (this.form.controls.travelType.value === "technique") {
      this.isTechnique = true
      this.loadTransport()
    } else this.isTechnique = false
  }


  onMapReady(event: any): void {
    this.endPointMap = event.target;


    this.endPointMap.events.add('', () => {
      debugger
    })
    debugger
  }
  searchControl: any

  onControlReady(event: any): void {
    /*this.searchControl = new ymaps.control.SearchControl({
      options: {
        // Будет производиться поиск только по топонимам.
        provider: 'yandex#map'
      }
    });*/
    this.searchControl = event.target

    this.searchControl.events.add('resultselect', function (e: any) {
      // Получает массив результатов.
     debugger
      // Индекс выбранного объекта.
      var selected = e.get('index');
      // Получает координаты выбранного объекта.
      //var point = results[selected].geometry.getCoordinates();
    })
    debugger
  }

}
