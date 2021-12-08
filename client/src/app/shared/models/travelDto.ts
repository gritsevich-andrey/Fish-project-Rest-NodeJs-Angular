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
  isOrganizer: boolean
  name: string

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
    isPublic: boolean,
    isOrganizer: boolean,
    name: string
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
    this.isOrganizer = isOrganizer
    this.name = name
  }
}
