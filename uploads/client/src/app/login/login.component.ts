import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  aSub!: Subscription;
  hide = true;

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
        MaterialService.toast('Теперь можете зайти в систему под своими данными');
      } else if (params['accessDenied']) {
        MaterialService.toast('Для начала авторизуйтесь в системе');
      } else if (params['sessionExpired']) {
        MaterialService.toast('Безопасность в приоритете. Пожалуйста, войдите в систему снова.');
      }
    });
  }

  onSubmit() {
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => {
       const token = localStorage.getItem('auth-token');
       // @ts-ignore
        const tokenSplit = token.split(' ');
        const decoded = jwt_decode(tokenSplit[1]);
        // @ts-ignore
        console.log(decoded.email);
        // @ts-ignore
        const userRoles = decoded.role;
        userRoles.forEach( (item: any) => {
          if (item === 'ADMIN') {
            this.router.navigate(['/administrator']);
          } else {
            this.router.navigate(['/cabinet'])
          }
        });
      },
      error => {
        MaterialService.toast(error.error.message);
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

  showPassword(): void {
    this.hide = !this.hide;
  }
}
