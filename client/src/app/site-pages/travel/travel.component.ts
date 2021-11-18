import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {TravelService} from "../../shared/services/travel.service";
import {YaReadyEvent} from "angular8-yandex-maps";
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
  map: ymaps.Map;
  form!: FormGroup;
  userEmail!: string
  userTravels: Travel[] = []
  isTechnique = false
  transports: any = []

  //Test
  points: any = []

  constructor(
    private userService: UserService,
    private travelService: TravelService,
    private cabinetService: CabinetService,
  ) {
    this.form = new FormGroup({
      travelType: new FormControl(''),
      travelTarget: new FormControl(''),
      peoplesCount: new FormControl(''),
      costPerPeople: new FormControl(''),
      description: new FormControl(''),
      travelTitle: new FormControl(''),
      startPointLatitude: new FormControl('55.74'),
      startPointLongitude: new FormControl('37.5'),
      endPointLatitude: new FormControl('55.64'),
      endPointLongitude: new FormControl('37.46'),
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
      data => {
        this.userTravels = data
        //Test
        data.forEach((el: any) => {
          this.points.push({
            latitude: el.coordinates.startPoint.latitude,
            longitude: el.coordinates.startPoint.longitude
          })
          this.points.push({
            latitude: el.coordinates.endPoint.latitude,
            longitude: el.coordinates.endPoint.longitude
          })
        })
        //
      },
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
          latitude: this.form.controls.startPointLatitude.value,
          longitude: this.form.controls.startPointLongitude.value
        },
        endPoint: {
          latitude: this.form.controls.endPointLatitude.value,
          longitude: this.form.controls.endPointLongitude.value
        }
      },
      travelTechnique: this.form.controls.travelTechnique.value
    }
    this.travelService.createTravel(travelData).subscribe(
      data => {
        this.form.reset();
        this.getUserTravels(this.userEmail);

        //Test
        this.points = []
        data.forEach((el: any) => {
          this.points.push({
            latitude: el.coordinates.startPoint.latitude,
            longitude: el.coordinates.startPoint.longitude
          })
          this.points.push({
            latitude: el.coordinates.endPoint.latitude,
            longitude: el.coordinates.endPoint.longitude
          })
        })
        //

        MaterialService.toast('Ваша поездка сохранена')
      },
      error => console.log(error)
    )
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>) {
    this.map = event.target;
  }

  getMapPointCoordinates() {
    //
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
    }
    else this.isTechnique = false
  }
}
