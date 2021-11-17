import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {TravelService} from "../../shared/services/travel.service";

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
  form!: FormGroup;
  userEmail!: string
  userTravels: Travel[] = []

  constructor(
    private userService: UserService,
    private travelService: TravelService
  ) {
    this.form = new FormGroup({
      travelType: new FormControl(''),
      travelTarget: new FormControl(''),
      peoplesCount: new FormControl(''),
      costPerPeople: new FormControl(''),
      description: new FormControl(''),
      travelTitle: new FormControl(''),
      coordinates: new FormControl('123.123.123 321.321.321'),
    });
  }

  ngOnInit(): void {
    this.userEmail = this.userService.getUserDataFromLocal()
    this.initMaterialize()
    this.getUserTravels(this.userEmail)
  }

  initMaterialize() {
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
    const selects = document.querySelectorAll('select');
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
      coordinates: this.form.controls.coordinates.value,
    }
    this.travelService.createTravel(travelData).subscribe(
      () => {
        this.form.reset();
        this.getUserTravels(this.userEmail);
      },
      error => console.log(error)
    )
  }
}
