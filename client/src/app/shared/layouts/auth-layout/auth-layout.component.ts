import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  header = [
    {
      title: 'Вход',
      icon_name: 'account_circle',
      href: 'login'
    },
    {
      title: 'Регистрация',
      icon_name: 'add_circle_outline',
      href: 'register'
    },
  ]
  footer_links = [
    {
      title: 'Ссылка 1',
      href: '#'
    },
    {
      title: 'Ссылка 2',
      href: '#'
    },
    {
      title: 'Ссылка 3',
      href: '#'
    },
    {
      title: 'Ссылка 4',
      href: '#'
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
