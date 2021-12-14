import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {MaterialService} from "../../../../../shared/classes/material.service";
import {TravelService} from "../../../../../shared/services/travel.service";
import {CabinetService} from "../../../../cabinet/cabinet.service";
import {ReviewComponent} from "../../../../map-travel/list-descriptions/review/review.component";
import {SelectStartPointComponent} from "../../../select-points/select-start-point/select-start-point.component";
import {SelectEndPointComponent} from "../../../select-points/select-end-point/select-end-point.component";
import {AddTransportModalComponent} from "../../../add-transport-modal/add-transport-modal.component";

@Component({
  selector: 'app-edit-travel-modal',
  templateUrl: './edit-travel-modal.component.html',
  styleUrls: ['./edit-travel-modal.component.scss']
})
export class EditTravelModalComponent implements OnInit {
  form!: FormGroup;
  techniqueForm!: FormGroup;
  travelId!: string;
  //Для отображения начальных точек
  placemarksStart: any = []
  placemarkEnd: any = []
  techList!: FormArray;
  isTechnique = false;

  constructor(
    private travelService: TravelService,
    private cabinetService: CabinetService,
    private dialogRef: MatDialogRef<any>,
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

    this.techniqueForm = new FormGroup({
      technique: new FormArray([]),
    })
  }

  ngOnInit(): void {
    this.techList = this.techniqueForm.get('technique') as FormArray;
    let {travel} = this.data
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
    this.form.controls
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
      name: this.form.controls.name.value
    }
    if (this.form.valid) {
      this.travelService.updateTravel(travelData, this.data.travel._id).subscribe(
        () => {
          //reload
          this.dialogRef.close()
          this.techniqueForm.reset()
          MaterialService.toast('Ваша поездка обновлена')
        },
        error => {
          console.log(error)
          MaterialService.toast('Ошибка обновления')
        }
      )
    } else MaterialService.toast('Заполните все поля')
  }

  setTravelDate(event: any) {
    this.form.controls.travelDate.setValue(event.target.value)
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

  loadTransport() {
    this.cabinetService.getTransportByEmail(this.data.userEmail).subscribe(
      data => {
        this.techList.controls = []
        data.forEach((el: any) => {
          //@ts-ignore
          let techArr = this.form.controls.travelTechnique.value?.[0]?.split(',');
          if (techArr?.includes(el.name))
            el.selected = true
          this.addTechnique(el)
        })
        this.openAddTransport()
      },
      error => console.log(error)
    )
  }

  createTechForm(data?: any): FormGroup {
    return new FormGroup({
      name: new FormControl(data?.name),
      license: new FormControl(data?.license),
      selected: new FormControl(data?.selected ?? false)
    });
  }

  addTechnique(data?: any) {
    this.techList.push(this.createTechForm(data));
  }

  openEndPointMapDialog() {
    let dialogRef = this.dialog.open(SelectEndPointComponent,
      {
        data: {
          placemarks: this.placemarkEnd,
          setCoordinates: this.setEndPointData.bind(this)
        }
      }
    );
    dialogRef.afterClosed().subscribe();
  }

  openStartPointMapDialog() {
    let dialogRef = this.dialog.open(SelectStartPointComponent, {
      data: {
        setData: this.setStartPointData.bind(this)
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  setStartPointData(latitude: string, longitude: string) {
    this.form.controls.startPointLatitude.setValue(latitude)
    this.form.controls.startPointLongitude.setValue(longitude)
  }

  setEndPointData(address: string, latitude: string, longitude: string) {
    this.form.controls.endPointAddress.setValue(address)
    this.form.controls.endPointLatitude.setValue(latitude)
    this.form.controls.endPointLongitude.setValue(longitude)
  }

  openAddTransport() {
    let dialogRef = this.dialog.open(AddTransportModalComponent, {
      data: {
        setTechnique: this.setTechnique.bind(this),
        selectTransport: this.selectTransport.bind(this),
        removeTechnique: this.removeTechnique.bind(this),
        addTechnique: this.addTechnique.bind(this),
        techniqueForm: this.techniqueForm
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  selectTransport(index: number, status: boolean) {
    this.techList.value[index].selected = !status
  }

  removeTechnique(index: any) {
    this.techList.removeAt(index);
  }

  setTechnique(cabinet: any) {
    this.cabinetService.updateCabinetData(cabinet).subscribe(
      () => {
        //@ts-ignore
        let tech = []
        this.techList.value.forEach((el: any) => {
          if (el.selected) tech.push(el.name)
        })
        //@ts-ignore
        this.form.controls.travelTechnique.setValue(tech)
        MaterialService.toast('Вы успешно загрузили технику')
      },
      error => console.log(error)
    )
  }
}
