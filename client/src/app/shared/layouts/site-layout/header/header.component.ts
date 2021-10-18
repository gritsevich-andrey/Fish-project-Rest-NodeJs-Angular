import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  nav_buttons: any[] = [];
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    let token = this.authService.getToken()
    if(token) {
      this.nav_buttons = [
        {
          href: '/login',
          title: 'Выход',
          icon_name: 'logout'
        }
      ]
    } else {
      this.nav_buttons = [
        {
          href: '/login',
          title: 'Вход',
          icon_name: 'account_circle'
        },
        {
          href: '/register',
          title: 'Регистрация',
          icon_name: 'add_circle_outline'
        }
      ]
    }
  }

  logout() {
    this.authService.logout()
  }

}
