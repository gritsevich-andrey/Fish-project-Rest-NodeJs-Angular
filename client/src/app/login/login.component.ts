import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(' ', [Validators.required, Validators.email]),
      password: new FormControl(' ', [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {

  }
  get f()
  {
    return this.form.controls;
  }
}
