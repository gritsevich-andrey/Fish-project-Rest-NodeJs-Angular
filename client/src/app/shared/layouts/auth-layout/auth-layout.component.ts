import { Component, OnInit } from '@angular/core';
import {FooterLink, HeaderNavButton} from "../../interfaces";

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  //Я думаю эту логику нужно как-то вынести или вообще сделать header статичным
  header: Array<HeaderNavButton> = [
    {
      title: 'Вход',
      icon_name: 'account_circle',
      href: '/login'
    },
    {
      title: 'Регистрация',
      icon_name: 'add_circle_outline',
      href: '/register'
    },
  ]
  footer_links: Array<FooterLink> = [
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
