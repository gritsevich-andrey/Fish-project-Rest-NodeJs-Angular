import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ComplaintService} from "../../../shared/services/complaint.service";
import {MaterialService} from "../../../shared/classes/material.service";

declare var M: { FormSelect: { init: (arg0: NodeListOf<Element>) => any; }, }

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss']
})

export class ComplaintComponent implements OnInit {
  inputText = ''
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<any>,
    private complaintsService: ComplaintService
  ) {
    this.form = new FormGroup({
      reason: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    const selects = document.querySelectorAll('select');
    M.FormSelect.init(selects);
  }

  send() {
    const description = this.form.controls.reason.value === 'Другое' ? this.inputText : this.form.controls.reason.value

    if (!description)
      return MaterialService.toast('Заполните поля')

    this.complaintsService.createComplaint(this.data.email, description, this.data.senderEmail).subscribe(
      () => {
        MaterialService.toast('Жалоба отправлена')
        this.dialog.close()
      },
      error => {
        MaterialService.toast('Ошибка отправки')
        console.log(error)
      }
    )
  }
}
