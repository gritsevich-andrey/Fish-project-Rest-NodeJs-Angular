import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MaterialService} from "../shared/classes/material.service";
import {User} from "../shared/interfaces";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  aSub!: Subscription
  hide = true;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("/^[a-z]+[a-z0-9._]+@[a-z]+\\.[a-z.]{2,5}$/"), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    const user: { password: any; role: [string]; email: any } = {
      email: this.form.value.email,
      password: this.form.value.password,
      role: ['USER']
    }

    this.aSub = this.auth.register(user).subscribe(
      () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        })
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );

  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  showPassword(): void {
    this.hide = !this.hide;
  }
}
