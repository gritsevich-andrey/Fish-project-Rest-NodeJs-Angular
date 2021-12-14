import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormArray, FormGroup} from "@angular/forms";
import {CabinetService} from "../../cabinet/cabinet.service";

@Component({
  selector: 'app-add-transport-modal',
  templateUrl: './add-transport-modal.component.html',
  styleUrls: ['./add-transport-modal.component.scss']
})
export class AddTransportModalComponent implements OnInit {
  techniqueForm!: FormGroup
  techList!: FormArray;
  selectTransport!: any;
  removeTechnique!: any;
  addTechnique!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cabinetService: CabinetService,
  ) {
  }

  ngOnInit(): void {
    this.techList = this.data.techniqueForm.controls.technique
    this.selectTransport = this.data.selectTransport
    this.removeTechnique = this.data.removeTechnique
    this.addTechnique = this.data.addTechnique
    debugger
  }

  techniqueFormSubmit() {
    this.cabinetService.getCabinetData(this.data.userEmail).subscribe(
      data => {
        let tech: any = []
        this.techList.value.forEach((el: any) => {
          tech.push({
            name: el.name,
            license: el.license
          })
        })
        //@ts-ignore
        data.technique = tech
        this.data.setTechnique(data)
      },
      error => console.log(error)
    )
  }
}
