import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  aSub!: Subscription;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("/^[a-z]+[a-z0-9._]+@[a-z]+\\.[a-z.]{2,5}$/"), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
// Может зайти
      } else if (params['accessDenied']) {
//Для начала авторизуйтесь в системе
      }
    });
  }

  onSubmit() {
      this.aSub = this.auth.login(this.form.value).subscribe(
        () => this.router.navigate(['/']),
        error => {
          console.warn(error);
          this.form.enable();
        }
      );
  }

  get f() {
    return this.form.controls;
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}
