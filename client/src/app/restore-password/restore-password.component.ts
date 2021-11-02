import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("/^[a-z]+[a-z0-9._]+@[a-z]+\\.[a-z.]{2,5}$/"), Validators.email]),
    })
  }

  onSubmit() {
    if (!this.f.email.hasError('email') && !this.f.email.hasError('required')) {
      this.auth.restorePassword(this.form.controls.email.value).subscribe(
        data => {
          MaterialService.toast('На вашу почту был отправлен новый пароль');
        },
        error => {
          MaterialService.toast(error.error.message)
          console.log(error)
        }
      )
    }
  }

  get f() {
    return this.form.controls;
  }

}
