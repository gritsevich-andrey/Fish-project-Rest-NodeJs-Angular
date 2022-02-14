import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {MaterialService} from "../../../shared/classes/material.service";

@Component({
  selector: 'app-reject',
  templateUrl: './reject.component.html',
  styleUrls: ['./reject.component.scss']
})
export class RejectComponent implements OnInit {
  rejectUserForm: FormGroup;

  constructor(
    private dialog: MatDialogRef<any>
  ) {
    this.rejectUserForm = new FormGroup({
      comment: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
  }

  rejectFormSubmit() {
    if (this.rejectUserForm.valid)
      this.dialog.close({reason: this.rejectUserForm.controls.comment.value})
    else
      MaterialService.toast('Укажите причину отказа')
  }

}
