import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TravelService} from "../../../shared/services/travel.service";
import {CabinetService} from "../../cabinet/cabinet.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MaterialService} from "../../../shared/classes/material.service";
import {SelectPointComponent} from "../select-point/select-point.component";
import {AddTransportModalComponent} from "../add-transport-modal/add-transport-modal.component";
import {Subscription} from "rxjs";
import {ViewPointMapComponent} from "../../live-feed/view-point-map/view-point-map.component";

declare var M: {
  FormSelect: { init: (arg0: NodeListOf<Element>) => any; },
  Modal: { init: (arg0: NodeListOf<Element>) => any; }
  Datepicker: { init: (arg0: NodeListOf<Element>, arg1: any) => any; }
}

@Component({
  selector: 'app-create-travel-modal',
  templateUrl: './create-travel-modal.component.html',
  styleUrls: ['./create-travel-modal.component.scss']
})
export class CreateTravelModalComponent implements OnInit, OnDestroy {
  userFIO!: string;
  form!: FormGroup;
  travelId!: string;
  technique: any[] = [];
  isTechnique = false;
  private sub?: Subscription;
  isFromMap = false


  constructor(
    public dialogRef: MatDialogRef<any>,
    private travelService: TravelService,
    private cabinetService: CabinetService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = new FormGroup({
      travelType: new FormControl('', Validators.required),
      travelTarget: new FormControl('', Validators.required),
      peoplesCount: new FormControl(''),
      costPerPeople: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      travelTechnique: new FormControl(),
      startPointLatitude: new FormControl('', Validators.required),
      startPointLongitude: new FormControl('', Validators.required),
      endPointLatitude: new FormControl('', Validators.required),
      endPointLongitude: new FormControl('', Validators.required),
      travelDate: new FormControl('', Validators.required),
      endPointAddress: new FormControl('', Validators.required),
      file: new FormControl(''),
      name: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.data.latitude && this.data.longitude) {
      this.isFromMap = true
      this.form.controls.endPointLatitude.setValue(this.data.latitude);
      this.form.controls.endPointLongitude.setValue(this.data.longitude);
    }
    this.initMaterialize()
    this.getCabinet(this.data.userEmail)
  }

  getCabinet(userEmail: string) {
    this.cabinetService.getCabinetData(userEmail).subscribe(
      ({fio, technique}) => {
        this.userFIO = fio
        // @ts-ignore
        this.technique = JSON.parse(technique)
      },
      error => console.log(error)
    )
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
      format: 'mm.dd.yyyy',
      minDate: new Date()
    }

    const modals = document.querySelectorAll('.modal');
    const selects = document.querySelectorAll('select');
    const datepickers = document.querySelectorAll('.datepicker');
    M.Modal.init(modals);
    M.FormSelect.init(selects);
    M.Datepicker.init(datepickers, options)
  }

  onSubmit() {
    let travelData = {
      userEmail: this.data.userEmail,
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
      isPublic: true,
      isOrganizer: true,
      name: this.form.controls.name.value,
      userFIO: this.userFIO
    }
    if (this.form.valid) {
      this.sub = this.travelService.createTravel(travelData).subscribe(
        () => {
          this.dialogRef.close()
          MaterialService.toast('Ваша поездка сохранена')
        },
        error => {
          console.log(error)
          MaterialService.toast('Ошибка сохранения')
        }
      )
    } else MaterialService.toast('Заполните все поля')
  }

  setTravelDate(event: any) {
    this.form.controls.travelDate.setValue(event.target.value)
  }

  onFileLoad(event: Event) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({file})
  }

  get f() {
    return this.form.controls;
  }

  travelTypeChange() {
    if (this.form.controls.travelType.value === "technique") {
      this.isTechnique = true
    } else this.isTechnique = false
  }

  openEndPointMapDialog() {
    let dialogRef = this.dialog.open(SelectPointComponent, this.form.controls.endPointLatitude.value ? {
      data: {
        placemark: {
          geometry: [this.form.controls.endPointLatitude.value, this.form.controls.endPointLongitude.value]
        }
      }
    } : {});
    dialogRef.afterClosed().subscribe(({latitude, longitude, address}) => {
      if (latitude && longitude) {
        this.form.controls.endPointAddress.setValue(address)
        this.form.controls.endPointLatitude.setValue(latitude)
        this.form.controls.endPointLongitude.setValue(longitude)
      }
    });
  }

  openStartPointMapDialog() {
    let dialogRef = this.dialog.open(SelectPointComponent, this.form.controls.startPointLatitude.value ? {
      data: {
        placemark: {
          geometry: [this.form.controls.startPointLatitude.value, this.form.controls.startPointLongitude.value]
        }
      }
    } : {});
    dialogRef.afterClosed().subscribe(({latitude, longitude}) => {
      if (latitude && longitude) {
        this.form.controls.startPointLatitude.setValue(latitude)
        this.form.controls.startPointLongitude.setValue(longitude)
      }
    });
  }

  openAddTransport() {
    const dialogRef = this.dialog.open(AddTransportModalComponent, {
      data: {
        userEmail: this.data.userEmail,
        setTechnique: this.setTechnique,
        technique: this.technique,
        form: this.form
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  setTechnique(tech: any) {
    this.form.controls.travelTechnique.setValue(tech)
  }

  onNoClick() {
    this.dialogRef.close(true);
  }

  openViewPointMap() {
    const dialogRef = this.dialog.open(ViewPointMapComponent, {
      data: {
        latitude: this.form.controls.endPointLatitude.value,
        longitude: this.form.controls.endPointLongitude.value
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
