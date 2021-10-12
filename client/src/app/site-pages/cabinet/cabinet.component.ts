import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent implements OnInit {
  form!: FormGroup;

  constructor() {
    this.form = new FormGroup({
      fio: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      technique: new FormControl('', Validators.required),
      juridicalPerson: new FormControl('', Validators.required),
      imgSrc: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {

  }

  onSubmit() {

  }
  get f() {
    return this.form.controls;
  }
}
