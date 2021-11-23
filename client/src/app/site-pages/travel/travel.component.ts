import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {TravelService} from "../../shared/services/travel.service";
import {CabinetService} from "../cabinet/cabinet.service";
import {MaterialService} from "../../shared/classes/material.service";
import {YaReadyEvent} from "angular8-yandex-maps";

declare var M: {
  FormSelect: { init: (arg0: NodeListOf<Element>) => any; },
  Modal: { init: (arg0: NodeListOf<Element>) => any; }
}

declare var ymaps: any;

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
  //@ts-ignore
  endPointMap: ymaps.Map;

  form!: FormGroup;
  userEmail!: string
  userTravels: Travel[] = []
  isTechnique = false
  transports: any = []

  constructor(
    private userService: UserService,
    private travelService: TravelService,
    private cabinetService: CabinetService,
  ) {
    this.form = new FormGroup({
      travelType: new FormControl('', Validators.required),
      travelTarget: new FormControl('', Validators.required),
      peoplesCount: new FormControl('', Validators.required),
      costPerPeople: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      travelTitle: new FormControl('', Validators.required),
      travelTechnique: new FormControl(''),
      startPointLatitude: new FormControl('', Validators.required),
      startPointLongitude: new FormControl('', Validators.required),
      endPointLatitude: new FormControl('', Validators.required),
      endPointLongitude: new FormControl('', Validators.required),
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

  createTravel(formData: any, formDirective: FormGroupDirective) {
    let travelData = {
      userEmail: this.userEmail,
      travelType: this.form.controls.travelType.value,
      travelTarget: this.form.controls.travelTarget.value,
      peoplesCount: this.form.controls.peoplesCount.value,
      costPerPeople: this.form.controls.costPerPeople.value,
      description: this.form.controls.description.value,
      title: this.form.controls.travelTitle.value,
      startPoint: [{
        latitude:  this.form.controls.startPointLatitude.value,
        longitude: this.form.controls.startPointLongitude.value
      }],
      endPoint: [{
        latitude: this.form.controls.endPointLatitude.value,
        longitude: this.form.controls.endPointLongitude.value
      }],
      travelTechnique: this.form.controls.travelTechnique.value
    }

    if(this.form.valid) {
      this.travelService.createTravel(travelData).subscribe(
          () => {
            this.closeModal();
            this.form.reset()
            this.getUserTravels(this.userEmail);
            MaterialService.toast('Ваша поездка сохранена')
          },
          error => {
            console.log(error)
            MaterialService.toast('Ошибка сохранения')
          }
        )
    } else MaterialService.toast('Заполните все поля')
  }

  closeModal() {
    const button: any = document.getElementById('button-modal-close')
    button.classList.add('modal-close')
    button.type = 'button'
    button.click()
    button.type = 'submit'
    button.classList.remove('modal-close')
  }

  onStartPointMapReady(event: YaReadyEvent<ymaps.Map>) {
    this.startPointMap = event.target;

    const searchControl = new ymaps.control.SearchControl({options: {provider: 'yandex#map'}});

    searchControl.events.add('resultselect', (e: any) => {
      let results = searchControl.getResultsArray();
      let selected = e.get('index');
      let point = results[selected].geometry.getCoordinates();
      this.form.controls.startPointLatitude.setValue(point[0])
      this.form.controls.startPointLongitude.setValue(point[1])
    })

    this.startPointMap.controls.remove('searchControl');
    this.startPointMap.controls.add(searchControl);
  }

  onEndPointMapReady(event: YaReadyEvent<ymaps.Map>) {
    this.endPointMap = event.target;

    const searchControl = new ymaps.control.SearchControl({options: {provider: 'yandex#map'}});

    searchControl.events.add('resultselect', (e: any) => {
      let results = searchControl.getResultsArray();
      let selected = e.get('index');
      let point = results[selected].geometry.getCoordinates();
      this.form.controls.endPointLatitude.setValue(point[0])
      this.form.controls.endPointLongitude.setValue(point[1])
    })

    this.endPointMap.controls.remove('searchControl');
    this.endPointMap.controls.add(searchControl);
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

  get f() {
    return this.form.controls;
  }
}
