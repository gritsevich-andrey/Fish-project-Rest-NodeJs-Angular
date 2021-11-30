import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {TravelService} from "../../shared/services/travel.service";
import {CabinetService} from "../cabinet/cabinet.service";
import {MaterialService} from "../../shared/classes/material.service";
import {YaGeocoderService, YaReadyEvent} from "angular8-yandex-maps";
import {TravelDto} from "../../shared/models/travelDto";
import {Sort} from "@angular/material/sort";

declare var M: {
  FormSelect: { init: (arg0: NodeListOf<Element>) => any; },
  Modal: { init: (arg0: NodeListOf<Element>) => any; }
  Datepicker: { init: (arg0: NodeListOf<Element>, arg1: any) => any; }
}

declare var ymaps: any;

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
  techniqueForm!: FormGroup;
  userEmail!: string
  userTravels: any[] = []
  isTechnique = false
  transports: any = []

  //Для отображения начальных точек
  placemarksStart: any = []
  placemarkEnd: any = []

  travelId!: string;
  // @ts-ignore
  travelData: TravelDto;
  isDriver = false

  constructor(
    private userService: UserService,
    private travelService: TravelService,
    private cabinetService: CabinetService,
    private yaGeocoderService: YaGeocoderService,
  ) {
    this.form = new FormGroup({
      travelType: new FormControl('', Validators.required),
      travelTarget: new FormControl('', Validators.required),
      peoplesCount: new FormControl(''),
      costPerPeople: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      travelTechnique: new FormControl(''),
      startPointLatitude: new FormControl('', Validators.required),
      startPointLongitude: new FormControl('', Validators.required),
      endPointLatitude: new FormControl('', Validators.required),
      endPointLongitude: new FormControl('', Validators.required),
      travelDate: new FormControl('', Validators.required),
      endPointAddress: new FormControl('', Validators.required),
      file: new FormControl('')
    });

    this.techniqueForm = new FormGroup({
      title: new FormControl('', Validators.required),
      license: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.isDriver = this.userService.getUserRole().includes('DRIVER')
    if (!this.isDriver) {
      //this.form.controls.peoplesCount.setValue(что-то)
    }
    this.userEmail = this.userService.getUserDataFromLocal()
    this.initMaterialize()
    this.getUserTravels(this.userEmail)
  }

  initMaterialize() {
    const options = {
      i18n: {
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        weekdaysShort: ['Вск', 'Пнд', 'Втр', 'Сре', 'Чтв', 'Птн', 'Суб'],
        weekdaysAbbrev: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
      },
      firstDay: 1,
      format: 'mm.dd.yyyy'
    }

    const modals = document.querySelectorAll('.modal');
    const selects = document.querySelectorAll('select');
    const datepickers = document.querySelectorAll('.datepicker');
    M.Modal.init(modals);
    M.FormSelect.init(selects);
    M.Datepicker.init(datepickers, options)
  }

  getUserTravels(userEmail: string) {
    this.travelService.getUserTravels(userEmail).subscribe(
      data => this.userTravels = data,
      error => console.log(error)
    )
  }

  setTravelDate(event: any) {
    this.form.controls.travelDate.setValue(event.target.value)
  }

  setTravelPublic(travelId: string) {
    let travelData = this.userTravels.filter((el: any) => el._id === travelId)
    //@ts-ignore
    travelData[0].isPublic = !travelData[0].isPublic;
    this.travelService.updateTravel(travelData[0], travelId).subscribe(
      () => MaterialService.toast('Успешно обновленно'),
      error => {
        MaterialService.toast('Ошибка обновления')
        console.log(error)
      }
    )
  }

  onSubmit(type: string) {
    this.travelData = {
      userEmail: this.userEmail,
      travelType: this.form.controls.travelType.value,
      travelTarget: this.form.controls.travelTarget.value,
      peoplesCount: this.form.controls.peoplesCount.value,
      costPerPeople: this.form.controls.costPerPeople.value,
      description: this.form.controls.description.value,
      title: this.form.controls.travelTarget.value,
      startPoint: [{
        latitude: this.form.controls.startPointLatitude.value,
        longitude: this.form.controls.startPointLongitude.value
      }],
      endPoint: [{
        latitude: this.form.controls.endPointLatitude.value,
        longitude: this.form.controls.endPointLongitude.value
      }],
      travelTechnique: this.form.controls.travelTechnique.value,
      date: this.form.controls.travelDate.value,
      address: this.form.controls.endPointAddress.value,
      file: this.form.controls.file.value,
      isPublic: true
    }

    if (this.form.valid) {
      if (type === 'create') {
        this.travelService.createTravel(this.travelData).subscribe(
          () => {
            this.closeModal('create');
            this.getUserTravels(this.userEmail);
            MaterialService.toast('Ваша поездка сохранена')
          },
          error => {
            console.log(error)
            MaterialService.toast('Ошибка сохранения')
          }
        )
      } else if (type === 'update') {
        this.travelService.updateTravel(this.travelData, this.travelId).subscribe(
          () => {
            this.closeModal('update');
            this.getUserTravels(this.userEmail);
            this.travelId = ''
            MaterialService.toast('Ваша поездка обновлена')
          },
          error => {
            console.log(error)
            MaterialService.toast('Ошибка обновления')
          }
        )
      }
    } else MaterialService.toast('Заполните все поля')
  }

  getPointAddress(latitude: number, longitude: number) {
    return this.yaGeocoderService.geocode([latitude, longitude])
  }

  closeModal(type: string) {
    const button: any = document.getElementById(type === 'create' ? 'button-modal-close' : 'button-edit-modal-close')
    button.classList.add('modal-close')
    button.type = 'button'
    button.click()
    button.type = 'submit'
    button.classList.remove('modal-close')
    this.form.reset()
  }

  onStartPointMapReady(event: YaReadyEvent<ymaps.Map>) {
    this.startPointMap = event.target;

    const searchControl = new ymaps.control.SearchControl({options: {provider: 'yandex#map'}});

    searchControl.events.add('resultselect', (e: any) => {
      this.placemarksStart = []
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
      this.placemarkEnd = []
      let results = searchControl.getResultsArray();
      let selected = e.get('index');
      let point = results[selected].geometry.getCoordinates();

      this.getPointAddress(point[0], point[1]).subscribe((result: any) => {
        const firstGeoObject = result.geoObjects.get(0);
        this.form.controls.endPointAddress.setValue(firstGeoObject.properties._data.text)
      })
      this.form.controls.endPointLatitude.setValue(point[0])
      this.form.controls.endPointLongitude.setValue(point[1])
    })

    this.endPointMap.controls.remove('searchControl');
    this.endPointMap.controls.add(searchControl);
  }

  loadTransport() {
    this.cabinetService.getTransportByEmail(this.userEmail).subscribe(
      data => this.transports = data,
      error => console.log(error)
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

  onFileLoad(event: Event) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({file})
  }

  openEditTravel(travel: any) {
    for (let item in travel) {
      this.form.controls[item]?.setValue(travel[item])
      if (item === 'date') this.form.controls.travelDate.setValue(travel[item])
      if (item === 'address') this.form.controls.endPointAddress.setValue(travel[item])
    }
    this.form.controls.startPointLatitude.setValue(travel.startPoint[0].latitude)
    this.form.controls.startPointLongitude.setValue(travel.startPoint[0].longitude)
    this.form.controls.endPointLatitude.setValue(travel.endPoint[0].latitude)
    this.form.controls.endPointLongitude.setValue(travel.endPoint[0].longitude)
    this.placemarksStart.push({
      geometry: [travel.startPoint[0].latitude, travel.startPoint[0].longitude],
      options: {
        preset: 'islands#icon',
        iconCaptionMaxWidth: '50',
      },
    })

    this.placemarkEnd.push({
      geometry: [travel.endPoint[0].latitude, travel.endPoint[0].longitude],
      options: {
        preset: 'islands#icon',
        iconCaptionMaxWidth: '50',
      },
    })

    this.travelId = travel._id
  }

  rescheduleForTwoWeeks() {
    let date = new Date(this.form.controls.travelDate.value).getTime()
    date += 14 * 24 * 60 * 60 * 1000
    //@ts-ignore
    date = new Date(date)
    //@ts-ignore
    this.form.controls.travelDate.setValue(`${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`)
  }

  rescheduleMonth() {
    let year = new Date(this.form.controls.travelDate.value).getFullYear()
    let month = new Date(this.form.controls.travelDate.value).getMonth()
    let day = new Date(this.form.controls.travelDate.value).getDate()

    let date = new Date(year, month + 1, day)
    this.form.controls.travelDate.setValue(`${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`)
  }

  sortData(sort: Sort) {
    const data = this.userTravels.slice();
    if (!sort.active || sort.direction === '') {
      this.userTravels = data;
      return;
    }

    //@ts-ignore
    this.userTravels = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': {
          //@ts-ignore
          return this.compare(a.date, b.date, isAsc);
        }
        case 'title': {
          //@ts-ignore
          return this.compare(a.title, b.title, isAsc);
        }
        default:
          return 0;
      }
    });
  }

  compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setTechnique(cabinet: any) {
    this.cabinetService.updateCabinetData(cabinet).subscribe(
      () => {
        const closeButton: any = document.getElementById('close-tech-modal')
        closeButton.click()
        this.techniqueForm.reset()
        this.loadTransport()
        MaterialService.toast('Вы успешно загрузили технику')
      },
      error => console.log(error)
    )
  }

  techniqueFormSubmit() {
    if (this.techniqueForm.valid) {
      this.cabinetService.getCabinetData(this.userEmail).subscribe(
        data => {
          let tech = [{
            name: this.techniqueForm.controls.title.value,
            license: this.techniqueForm.controls.license.value
          }]
          data.technique = tech
          this.setTechnique(data)
        },
        error => console.log(error)
      )
    } else MaterialService.toast('Заполните все поля')
  }
}
