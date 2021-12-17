import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {CabinetService} from "../../cabinet/cabinet.service";
import {MaterialService} from "../../../shared/classes/material.service";

@Component({
  selector: 'app-add-transport-modal',
  templateUrl: './add-transport-modal.component.html',
  styleUrls: ['./add-transport-modal.component.scss']
})
export class AddTransportModalComponent implements OnInit {
  techniqueForm!: FormGroup
  techList!: FormArray;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cabinetService: CabinetService,
    private dialogRef: MatDialogRef<any>,
  ) {
    this.techniqueForm = new FormGroup({
      technique: new FormArray([]),
    })
  }

  ngOnInit(): void {
    this.loadTransport()
  }

  loadTransport() {
    this.techList = this.techniqueForm.get('technique') as FormArray;
    this.cabinetService.getTransportByEmail(this.data.userEmail).subscribe(
      transports => {
        this.techList.controls = []

        let techArr: any = this.data.form.controls.travelTechnique.value?.[0].split(',')
        transports.forEach((transport: any) => {
          //@ts-ignore
          if (techArr.includes(transport.name))
            transport.selected = true
          this.addTechnique(transport)
        })
      },
      error => console.log(error)
    )
  }

  addTechnique(transport?: any) {
    this.techList.push(this.createTechForm(transport));
  }

  createTechForm(transport?: any): FormGroup {
    return new FormGroup({
      name: new FormControl(transport?.name),
      license: new FormControl(transport?.license),
      selected: new FormControl(transport?.selected ?? false)
    });
  }

  techniqueFormSubmit() {
    this.cabinetService.getCabinetData(this.data.userEmail).subscribe(
      cabinet => {
        let tech: any = []
        this.techList.value.forEach((technique: any) => {
          tech.push({
            name: technique.name,
            license: technique.license
          })
        })
        //@ts-ignore
        cabinet.technique = tech
        this.setTechnique(cabinet)
      },
      error => console.log(error)
    )
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
        this.data.setTechnique(tech)
        this.dialogRef.close()
        MaterialService.toast('Вы успешно загрузили технику')
      },
      error => console.log(error)
    )
  }
}
