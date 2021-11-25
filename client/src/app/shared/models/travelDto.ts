// userEmail: this.userEmail,
//   travelType: this.form.controls.travelType.value,
//   travelTarget: this.form.controls.travelTarget.value,
//   peoplesCount: this.form.controls.peoplesCount.value,
//   costPerPeople: this.form.controls.costPerPeople.value,
//   description: this.form.controls.description.value,
//   title: this.form.controls.travelTarget.value,
//   startPoint: [{
//   latitude: this.form.controls.startPointLatitude.value,
//   longitude: this.form.controls.startPointLongitude.value
// }],
//   endPoint: [{
//   latitude: this.form.controls.endPointLatitude.value,
//   longitude: this.form.controls.endPointLongitude.value
// }],
//   travelTechnique: this.form.controls.travelTechnique.value,
//   date: this.form.controls.travelDate.value,
//   address: this.form.controls.endPointAddress.value,
//   file: this.form.controls.file.value,
//   isPublic: true

import {File} from "@angular/compiler-cli/src/ngtsc/file_system/testing/src/mock_file_system";

export class TravelDto {
  userEmail: string
  travelType: string
  travelTarget: string
  peoplesCount: number
  costPerPeople: number
  description: string
  title: string
  startPoint: any[]
  endPoint: any[]
  travelTechnique: any[]
  date: string
  address: string
  file: File
  isPublic: boolean

  constructor(
    userEmail: string,
    travelType: string,
    travelTarget: string,
    peoplesCount: number,
    costPerPeople: number,
    description: string,
    title: string,
    startPoint: any[],
    endPoint: any[],
    travelTechnique: any[],
    date: string,
    address: string,
    endPointAddress: string,
    file: File,
    isPublic: boolean
  ) {
    this.userEmail = userEmail
    this.travelType = travelType
    this.travelTarget = travelTarget
    this.peoplesCount = peoplesCount
    this.costPerPeople = costPerPeople
    this.description = description
    this.title = title
    this.startPoint = startPoint
    this.endPoint = endPoint
    this.travelTechnique = travelTechnique
    this.date = date
    this.address = endPointAddress
    this.file = file
    this.isPublic = isPublic
  }
}
