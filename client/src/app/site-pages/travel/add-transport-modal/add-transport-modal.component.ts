import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {CabinetService} from "../../cabinet/cabinet.service";
import {MaterialService} from "../../../shared/classes/material.service";
import {error} from "password-validator/typings/constants";
import {AskDialogComponent} from "../../cabinet/ask-dialog/ask-dialog.component";

@Component({
  selector: 'app-add-transport-modal',
  templateUrl: './add-transport-modal.component.html',
  styleUrls: ['./add-transport-modal.component.scss']
})
export class AddTransportModalComponent implements OnInit {
  techniqueForm!: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cabinetService: CabinetService,
    private dialogRef: MatDialogRef<any>,
    private dialog: MatDialog
  ) {
    this.techniqueForm = new FormGroup({
      techList: new FormArray([])
    })
  }

  ngOnInit(): void {
    this.loadTechnique()
  }

  get techList() {
    return this.techniqueForm.controls.techList as FormArray
  }

  loadTechnique() {
    this.cabinetService.getCabinetData(this.data.userEmail).subscribe(({technique}) => {
      // @ts-ignore
      technique = JSON.parse(technique)
      if (this.data.technique) {
        technique.map((tech: any) => {
          this.data.technique.map((selectedTech: any) => {
            if (tech.name === selectedTech.name && tech.license === selectedTech.license) {
              //this.techList.push(this.createTechForm(tech.name, tech.license, true))
              tech.selected = true
            }
          })
        })
        technique.map((tech: any) => {
          if (tech.selected) {
            this.techList.push(this.createTechForm(tech.name, tech.license, true))
          } else {
            this.techList.push(this.createTechForm(tech.name, tech.license, false))
          }
        })

      } else {
        technique.map((tech: any) => {
          this.techList.push(this.createTechForm(tech.name, tech.license, false))
        })
      }
    })
  }

  selectTransport(index: number, status: boolean) {
    this.techList.value[index].selected = !status
  }

  createTechForm(name?: string, license?: string, selected?: boolean): FormGroup {
    return new FormGroup({
      name: new FormControl(name ?? ''),
      license: new FormControl(license ?? ''),
      selected: new FormControl(selected ?? false)
    })
  }

  removeTechnique(index: number) {
    // const dialogRef = this.dialog.open(AskDialogComponent);
    // dialogRef.afterClosed()
    //   .subscribe((data: string) => {
    //     if (data === 'yes') {
    this.techList.removeAt(index);
    // const cabinetData = {
    //   email: this.data.userEmail,
    //   technique: this.techList.value.map(({selected, ...rest}: any) => rest)
    // }
    // this.cabinetService.updateCabinetData(cabinetData)
    //   .subscribe(
    //     () => MaterialService.toast('Техника удалена'),
    //     error => MaterialService.toast('Ошибка удаления')
    //   )
    // }
    // });
  }

  addTechnique() {
    this.techList.push(this.createTechForm());
    const cabinetData = {
      email: this.data.userEmail,
      technique: this.techList.value.map(({selected, ...rest}: any) => rest)
    }
    this.cabinetService.updateCabinetData(cabinetData)
      .subscribe(
        () => MaterialService.toast('Техника добавлена'),
        error => MaterialService.toast('Ошибка добавления')
      )
  }

  techniqueFormSubmit() {
    const cabinetData = {
      email: this.data.userEmail,
      technique: this.techList.value.map(({selected, ...rest}: any) => rest)
    }
    this.cabinetService.updateCabinetData(cabinetData)
      .subscribe(
        () => {
        },
        error => MaterialService.toast('Ошибка добавления')
      )
    this.dialogRef.close(this.techList.value.filter((tech: any) => tech.selected).map(({
                                                                                         selected,
                                                                                         ...rest
                                                                                       }: any) => rest))
  }
}
